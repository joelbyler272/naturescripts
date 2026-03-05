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

/**
 * Weekly summary cron job.
 * Runs every Monday at 9am UTC (configured in vercel.json).
 * Sends Pro users a weekly progress email with AI insights.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const resend = new Resend(RESEND_API_KEY);

  // Get Pro users with tracking data in the past 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const { data: proUsers, error: usersError } = await supabase
    .from('profiles')
    .select('id, first_name, email_preferences')
    .eq('tier', 'pro');

  if (usersError || !proUsers) {
    console.error('[WEEKLY SUMMARY] Error fetching pro users:', usersError);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of proUsers) {
    try {
      // Check email preferences
      const prefs = user.email_preferences as { weekly_summary?: boolean } | null;
      if (prefs && prefs.weekly_summary === false) {
        skipped++;
        continue;
      }

      // Get user's email from auth
      const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
      if (!authUser?.user?.email) {
        skipped++;
        continue;
      }

      // Fetch symptom data
      const { data: symptoms } = await supabase
        .from('symptom_logs')
        .select('symptom_name, severity, date')
        .eq('user_id', user.id)
        .gte('date', weekAgoStr)
        .order('date');

      // Fetch supplement adherence
      const { data: supplements } = await supabase
        .from('supplement_logs')
        .select('supplement_name, taken')
        .eq('user_id', user.id)
        .gte('date', weekAgoStr);

      // Fetch habit completion
      const { data: habits } = await supabase
        .from('habit_logs')
        .select('habit_name, completed')
        .eq('user_id', user.id)
        .gte('date', weekAgoStr);

      // Skip if no tracking data at all
      if ((!symptoms || symptoms.length === 0) && (!supplements || supplements.length === 0) && (!habits || habits.length === 0)) {
        skipped++;
        continue;
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

      // Calculate adherence percentages
      const supplementTotal = supplements?.length || 0;
      const supplementTaken = supplements?.filter(s => s.taken).length || 0;
      const supplementAdherence = supplementTotal > 0 ? Math.round((supplementTaken / supplementTotal) * 100) : 0;

      const habitTotal = habits?.length || 0;
      const habitCompleted = habits?.filter(h => h.completed).length || 0;
      const habitCompletion = habitTotal > 0 ? Math.round((habitCompleted / habitTotal) * 100) : 0;

      // Generate AI insights
      const weeklyData: WeeklyData = {
        firstName: user.first_name || 'there',
        symptomSummary,
        supplementAdherence: supplements?.length ? [{ name: 'Overall', pct: supplementAdherence }] : [],
        habitCompletion: habits?.length ? [{ name: 'Overall', pct: habitCompletion }] : [],
      };

      const insights = await generateWeeklyInsights(weeklyData);

      // Generate and send email
      const html = generateWeeklySummaryHtml({
        firstName: user.first_name || 'there',
        weekOf: weekAgoStr,
        symptomSummary,
        supplementAdherence,
        habitCompletion,
        insights,
        dashboardUrl: `${APP_URL}/dashboard`,
      });

      await resend.emails.send({
        from: `NatureScripts <${FROM_EMAIL}>`,
        to: [authUser.user.email],
        subject: `Your weekly health report is ready`,
        html,
      });

      sent++;
    } catch (err) {
      console.error(`[WEEKLY SUMMARY] Error processing user ${user.id}:`, err);
      errors++;
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    skipped,
    errors,
    total: proUsers.length,
  });
}
