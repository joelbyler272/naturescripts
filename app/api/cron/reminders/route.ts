import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { generateReminderHtml } from '@/lib/email/templates';

const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://naturescripts.com';

const INACTIVITY_THRESHOLD_DAYS = 3;
const REMINDER_COOLDOWN_DAYS = 7;

/**
 * Daily reminder cron job.
 * Runs daily at 10am UTC (configured in vercel.json).
 * Sends gentle reminders to Pro users who haven't logged in 3+ days.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const resend = new Resend(RESEND_API_KEY);

  const now = new Date();
  const thresholdDate = new Date(now);
  thresholdDate.setDate(thresholdDate.getDate() - INACTIVITY_THRESHOLD_DAYS);
  const thresholdStr = thresholdDate.toISOString().split('T')[0];

  const cooldownDate = new Date(now);
  cooldownDate.setDate(cooldownDate.getDate() - REMINDER_COOLDOWN_DAYS);

  // Get Pro users
  const { data: proUsers, error: usersError } = await supabase
    .from('profiles')
    .select('id, first_name, last_reminder_sent_at, email_preferences')
    .eq('tier', 'pro');

  if (usersError || !proUsers) {
    console.error('[REMINDERS] Error fetching pro users:', usersError);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of proUsers) {
    try {
      // Check email preferences
      const prefs = user.email_preferences as { reminders?: boolean } | null;
      if (prefs && prefs.reminders === false) {
        skipped++;
        continue;
      }

      // Skip if reminder sent recently
      if (user.last_reminder_sent_at && new Date(user.last_reminder_sent_at) > cooldownDate) {
        skipped++;
        continue;
      }

      // Check for recent tracking activity across all 3 tables
      const [{ count: symptomCount }, { count: supplementCount }, { count: habitCount }] = await Promise.all([
        supabase.from('symptom_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('date', thresholdStr),
        supabase.from('supplement_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('date', thresholdStr),
        supabase.from('habit_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('date', thresholdStr),
      ]);

      const totalRecent = (symptomCount || 0) + (supplementCount || 0) + (habitCount || 0);
      if (totalRecent > 0) {
        skipped++;
        continue;
      }

      // Find days since last log
      const { data: lastLog } = await supabase
        .from('supplement_logs')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      const daysSinceLastLog = lastLog
        ? Math.floor((now.getTime() - new Date(lastLog.date + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24))
        : INACTIVITY_THRESHOLD_DAYS;

      // Get user email
      const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
      if (!authUser?.user?.email) {
        skipped++;
        continue;
      }

      // Send reminder
      const html = generateReminderHtml({
        firstName: user.first_name || 'there',
        daysSinceLastLog,
        dashboardUrl: `${APP_URL}/tracking`,
      });

      await resend.emails.send({
        from: `NatureScripts <${FROM_EMAIL}>`,
        to: [authUser.user.email],
        subject: `Time to check in with your protocol`,
        html,
      });

      // Update last_reminder_sent_at
      await supabase
        .from('profiles')
        .update({ last_reminder_sent_at: now.toISOString() })
        .eq('id', user.id);

      sent++;
    } catch (err) {
      console.error(`[REMINDERS] Error processing user ${user.id}:`, err);
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
