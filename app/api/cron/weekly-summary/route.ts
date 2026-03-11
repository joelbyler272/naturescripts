import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { generateWeeklyInsights, WeeklyData } from '@/lib/email/insights';
import { generateWeeklySummaryHtml } from '@/lib/email/templates';

const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://naturescripts.com';

const BATCH_SIZE = 50;
const CONCURRENCY = 5; // Process 5 users simultaneously

/**
 * Weekly summary cron job.
 * Runs every Monday at 9am UTC (configured in vercel.json).
 * Sends Pro users a weekly progress email with AI insights.
 *
 * Uses pagination + concurrency to handle large user bases.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const resend = new Resend(RESEND_API_KEY);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  let totalProcessed = 0;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    // Paginate through Pro users
    const { data: proUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, first_name, email_preferences')
      .eq('tier', 'pro')
      .range(page * BATCH_SIZE, (page + 1) * BATCH_SIZE - 1);

    if (usersError) {
      console.error('[WEEKLY SUMMARY] Error fetching pro users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!proUsers || proUsers.length === 0) {
      hasMore = false;
      break;
    }

    if (proUsers.length < BATCH_SIZE) {
      hasMore = false;
    }

    // Process batch with controlled concurrency
    for (let i = 0; i < proUsers.length; i += CONCURRENCY) {
      const chunk = proUsers.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        chunk.map(user => processUser(user, supabase, resend, weekAgoStr))
      );

      for (const result of results) {
        totalProcessed++;
        if (result.status === 'fulfilled') {
          if (result.value === 'sent') sent++;
          else skipped++;
        } else {
          errors++;
        }
      }
    }

    page++;
  }

  return NextResponse.json({ success: true, sent, skipped, errors, total: totalProcessed });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processUser(
  user: { id: string; first_name: string | null; email_preferences: unknown },
  supabase: any,
  resend: Resend,
  weekAgoStr: string
): Promise<'sent' | 'skipped'> {
  // Check email preferences
  const prefs = user.email_preferences as { weekly_summary?: boolean } | null;
  if (prefs && prefs.weekly_summary === false) return 'skipped';

  // Get user email
  const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
  if (!authUser?.user?.email) return 'skipped';

  // Fetch all tracking data in parallel
  const [{ data: symptoms }, { data: supplements }, { data: habits }] = await Promise.all([
    supabase.from('symptom_logs').select('symptom_name, severity, date').eq('user_id', user.id).gte('date', weekAgoStr).order('date'),
    supabase.from('supplement_logs').select('supplement_name, taken').eq('user_id', user.id).gte('date', weekAgoStr),
    supabase.from('habit_logs').select('habit_name, completed').eq('user_id', user.id).gte('date', weekAgoStr),
  ]);

  // Skip if no tracking data
  if ((!symptoms || symptoms.length === 0) && (!supplements || supplements.length === 0) && (!habits || habits.length === 0)) {
    return 'skipped';
  }

  // Aggregate symptom trends
  const symptomMap = new Map<string, number[]>();
  for (const s of symptoms || []) {
    const existing = symptomMap.get(s.symptom_name) || [];
    existing.push(s.severity);
    symptomMap.set(s.symptom_name, existing);
  }

  const symptomSummary = Array.from(symptomMap.entries()).map(([name, severities]) => {
    const avg = severities.reduce((a, b) => a + b, 0) / severities.length;
    const firstHalf = severities.slice(0, Math.ceil(severities.length / 2));
    const secondHalf = severities.slice(Math.ceil(severities.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : firstAvg;
    const trend: 'improving' | 'stable' | 'worsening' = secondAvg < firstAvg - 0.5 ? 'improving' : secondAvg > firstAvg + 0.5 ? 'worsening' : 'stable';
    return { name, avgSeverity: avg, trend };
  });

  const supplementTotal = supplements?.length || 0;
  const supplementTaken = supplements?.filter((s: any) => s.taken).length || 0;
  const supplementAdherence = supplementTotal > 0 ? Math.round((supplementTaken / supplementTotal) * 100) : 0;

  const habitTotal = habits?.length || 0;
  const habitCompleted = habits?.filter((h: any) => h.completed).length || 0;
  const habitCompletion = habitTotal > 0 ? Math.round((habitCompleted / habitTotal) * 100) : 0;

  // Generate AI insights
  const weeklyData: WeeklyData = {
    firstName: user.first_name || 'there',
    symptomSummary,
    supplementAdherence: supplements?.length ? [{ name: 'Overall', pct: supplementAdherence }] : [],
    habitCompletion: habits?.length ? [{ name: 'Overall', pct: habitCompletion }] : [],
  };

  const insights = await generateWeeklyInsights(weeklyData);

  const APP_URL_SAFE = process.env.NEXT_PUBLIC_APP_URL || 'https://naturescripts.com';

  // Generate and send email
  const html = generateWeeklySummaryHtml({
    firstName: user.first_name || 'there',
    weekOf: weekAgoStr,
    symptomSummary,
    supplementAdherence,
    habitCompletion,
    insights,
    dashboardUrl: `${APP_URL_SAFE}/dashboard`,
  });

  await resend.emails.send({
    from: `NatureScripts <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
    to: [authUser.user.email],
    subject: `Your weekly health report is ready`,
    html,
  });

  return 'sent';
}
