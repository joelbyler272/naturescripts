-- Migration 005: Tracking tables for symptom logging, supplement adherence, and habit tracking
-- These tables power the Pro-only Progress Tracking feature.

-- ============================================
-- SYMPTOM LOGS
-- No unique constraint: users may log the same symptom multiple times per day
-- (e.g., morning headache vs evening headache with different severities)
-- ============================================
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  symptom_name TEXT NOT NULL CHECK (char_length(symptom_name) <= 100),
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own symptom_logs"
  ON public.symptom_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own symptom_logs"
  ON public.symptom_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own symptom_logs"
  ON public.symptom_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own symptom_logs"
  ON public.symptom_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_symptom_logs_user_date ON public.symptom_logs(user_id, date DESC);
CREATE INDEX idx_symptom_logs_user_symptom ON public.symptom_logs(user_id, symptom_name, date DESC);

-- ============================================
-- SUPPLEMENT LOGS
-- UNIQUE on (user_id, date, supplement_name) enables upsert toggling
-- ============================================
CREATE TABLE IF NOT EXISTS public.supplement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplement_name TEXT NOT NULL CHECK (char_length(supplement_name) <= 100),
  taken BOOLEAN NOT NULL DEFAULT false,
  protocol_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date, supplement_name)
);

ALTER TABLE public.supplement_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own supplement_logs"
  ON public.supplement_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own supplement_logs"
  ON public.supplement_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own supplement_logs"
  ON public.supplement_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own supplement_logs"
  ON public.supplement_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_supplement_logs_user_date ON public.supplement_logs(user_id, date DESC);

-- ============================================
-- HABIT LOGS
-- UNIQUE on (user_id, date, habit_name) enables upsert toggling
-- ============================================
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  habit_name TEXT NOT NULL CHECK (char_length(habit_name) <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date, habit_name)
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own habit_logs"
  ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit_logs"
  ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit_logs"
  ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit_logs"
  ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_habit_logs_user_date ON public.habit_logs(user_id, date DESC);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE TRIGGER update_symptom_logs_updated_at
  BEFORE UPDATE ON public.symptom_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_supplement_logs_updated_at
  BEFORE UPDATE ON public.supplement_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_habit_logs_updated_at
  BEFORE UPDATE ON public.habit_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- UPDATE ACCOUNT DELETION TO INCLUDE NEW TABLES
-- ============================================
CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: can only delete your own account';
  END IF;

  DELETE FROM public.symptom_logs WHERE user_id = p_user_id;
  DELETE FROM public.supplement_logs WHERE user_id = p_user_id;
  DELETE FROM public.habit_logs WHERE user_id = p_user_id;
  DELETE FROM public.api_usage WHERE user_id = p_user_id;
  DELETE FROM public.daily_usage WHERE user_id = p_user_id;
  DELETE FROM public.consultations WHERE user_id = p_user_id;
  DELETE FROM public.profiles WHERE id = p_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
