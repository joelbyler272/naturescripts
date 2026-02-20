-- Down migration: Remove progress tracking tables
-- Run this to rollback 004_progress_tracking.sql

DROP TRIGGER IF EXISTS progress_logs_updated_at ON public.progress_logs;
DROP FUNCTION IF EXISTS update_progress_logs_updated_at();
DROP INDEX IF EXISTS idx_progress_logs_user_date;
DROP POLICY IF EXISTS "Users can view own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Users can insert own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Users can update own progress logs" ON public.progress_logs;
DROP POLICY IF EXISTS "Users can delete own progress logs" ON public.progress_logs;
DROP TABLE IF EXISTS public.progress_logs;
