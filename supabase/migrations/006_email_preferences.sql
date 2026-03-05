-- Migration 006: Email preferences for weekly summaries and reminders

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_preferences JSONB NOT NULL DEFAULT '{"weekly_summary": true, "reminders": true}';
