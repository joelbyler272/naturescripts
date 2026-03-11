-- Migration: Add progress tracking for Pro users
-- Allows users to log daily energy levels, symptoms, and notes

CREATE TABLE IF NOT EXISTS public.progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress logs
CREATE POLICY "Users can view own progress logs"
  ON public.progress_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress logs"
  ON public.progress_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress logs"
  ON public.progress_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress logs"
  ON public.progress_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Index for efficient date-based queries
CREATE INDEX idx_progress_logs_user_date ON public.progress_logs(user_id, date DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_progress_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER progress_logs_updated_at
  BEFORE UPDATE ON public.progress_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_progress_logs_updated_at();
