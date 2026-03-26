-- ============================================================
-- CONSOLIDATED MIGRATION: 009 → 012
-- NatureScripts — Phases 1–4
-- Safe to run: all statements are idempotent (IF NOT EXISTS / CREATE OR REPLACE)
-- ============================================================

-- ============================================
-- 009: Pharmaceutical Equivalents (Phase 1.1)
-- ============================================

ALTER TABLE public.remedies
ADD COLUMN IF NOT EXISTS pharmaceutical_equivalents JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.remedies.pharmaceutical_equivalents
  IS 'Array of {drug, drugClass, mechanism} objects showing pharmaceutical comparisons';

-- ============================================
-- 010: Expanded Profile Fields (Phase 1.3)
-- ============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,1),
ADD COLUMN IF NOT EXISTS activity_level TEXT,
ADD COLUMN IF NOT EXISTS sleep_hours NUMERIC(3,1),
ADD COLUMN IF NOT EXISTS stress_level INTEGER,
ADD COLUMN IF NOT EXISTS diet_type TEXT,
ADD COLUMN IF NOT EXISTS wellness_goals TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.age IS 'User age in years';
COMMENT ON COLUMN public.profiles.gender IS 'male, female, non-binary, prefer-not-to-say';
COMMENT ON COLUMN public.profiles.height_cm IS 'Height stored in centimeters (UI displays inches)';
COMMENT ON COLUMN public.profiles.weight_kg IS 'Weight stored in kilograms (UI displays pounds)';
COMMENT ON COLUMN public.profiles.activity_level IS 'sedentary, light, moderate, active, very-active';
COMMENT ON COLUMN public.profiles.sleep_hours IS 'Average nightly sleep in hours';
COMMENT ON COLUMN public.profiles.stress_level IS 'Self-reported stress 1-10';
COMMENT ON COLUMN public.profiles.diet_type IS 'omnivore, vegetarian, vegan, keto, paleo, other';
COMMENT ON COLUMN public.profiles.wellness_goals IS 'Array of wellness goals';

-- ============================================
-- 011: Full Wellness Intake Fields (Phase 2)
-- ============================================

-- Diet & Nutrition
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS food_sensitivities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS caffeine_intake TEXT,
ADD COLUMN IF NOT EXISTS sugar_consumption TEXT,
ADD COLUMN IF NOT EXISTS water_intake TEXT,
ADD COLUMN IF NOT EXISTS alcohol_use TEXT,
ADD COLUMN IF NOT EXISTS tobacco_use TEXT;

-- Lifestyle
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS exercise_frequency TEXT,
ADD COLUMN IF NOT EXISTS sunlight_exposure TEXT;

-- Mental & Emotional
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mood_patterns TEXT,
ADD COLUMN IF NOT EXISTS focus_ability INTEGER,
ADD COLUMN IF NOT EXISTS meditation_practice BOOLEAN DEFAULT false;

-- Personal
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS blood_type TEXT;

-- Intake tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS intake_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS intake_completed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.food_sensitivities IS 'Array of food sensitivities/allergies';
COMMENT ON COLUMN public.profiles.caffeine_intake IS 'none, low, moderate, high';
COMMENT ON COLUMN public.profiles.sugar_consumption IS 'low, moderate, high';
COMMENT ON COLUMN public.profiles.water_intake IS 'less-than-4, 4-6, 6-8, more-than-8 (glasses/day)';
COMMENT ON COLUMN public.profiles.alcohol_use IS 'none, occasional, moderate, frequent';
COMMENT ON COLUMN public.profiles.tobacco_use IS 'none, former, occasional, regular';
COMMENT ON COLUMN public.profiles.exercise_frequency IS 'none, 1-2x, 3-4x, 5-plus (per week)';
COMMENT ON COLUMN public.profiles.sunlight_exposure IS 'minimal, some, moderate, plenty';
COMMENT ON COLUMN public.profiles.mood_patterns IS 'stable, mostly-good, variable, mostly-low';
COMMENT ON COLUMN public.profiles.focus_ability IS 'Self-reported focus 1-10';
COMMENT ON COLUMN public.profiles.meditation_practice IS 'Whether user has a meditation/mindfulness practice';
COMMENT ON COLUMN public.profiles.blood_type IS 'A+, A-, B+, B-, AB+, AB-, O+, O-, unknown';
COMMENT ON COLUMN public.profiles.intake_completed IS 'Whether user completed the wellness intake';

-- ============================================
-- Health Context Function (final version)
-- Supersedes versions from 010 and 011
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_health_context(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_context JSONB;
BEGIN
  IF auth.uid() != p_user_id THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    -- Core health data
    'health_conditions', COALESCE(health_conditions, '{}'),
    'medications', COALESCE(medications, '[]'),
    'supplements', COALESCE(supplements, '[]'),
    'health_notes', COALESCE(health_notes, ''),
    'tier', tier,
    -- Personal
    'age', age,
    'gender', gender,
    'height_cm', height_cm,
    'weight_kg', weight_kg,
    'blood_type', blood_type,
    -- Lifestyle
    'activity_level', activity_level,
    'sleep_hours', sleep_hours,
    'stress_level', stress_level,
    'exercise_frequency', exercise_frequency,
    'sunlight_exposure', sunlight_exposure,
    -- Diet & Nutrition
    'diet_type', diet_type,
    'food_sensitivities', COALESCE(food_sensitivities, '{}'),
    'caffeine_intake', caffeine_intake,
    'sugar_consumption', sugar_consumption,
    'water_intake', water_intake,
    'alcohol_use', alcohol_use,
    'tobacco_use', tobacco_use,
    -- Mental & Emotional
    'mood_patterns', mood_patterns,
    'focus_ability', focus_ability,
    'meditation_practice', meditation_practice,
    -- Goals
    'wellness_goals', COALESCE(wellness_goals, '{}')
  ) INTO v_context
  FROM public.profiles
  WHERE id = p_user_id;

  RETURN COALESCE(v_context, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 012: Document Storage (Phase 3)
-- ============================================

-- Storage bucket for health documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'health-documents',
  'health-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (DROP IF EXISTS to make idempotent)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
END $$;

CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- Document Metadata Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'other',
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider TEXT,
  test_date DATE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  parsed_text TEXT,
  parsed_data JSONB DEFAULT '{}'::JSONB,
  ai_interpretation TEXT,
  ai_interpretation_data JSONB DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON public.user_documents(document_type);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own documents" ON public.user_documents;
  DROP POLICY IF EXISTS "Users can insert own documents" ON public.user_documents;
  DROP POLICY IF EXISTS "Users can update own documents" ON public.user_documents;
  DROP POLICY IF EXISTS "Users can delete own documents" ON public.user_documents;
END $$;

CREATE POLICY "Users can view own documents"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.user_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.user_documents FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Lab Results Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.user_documents(id) ON DELETE SET NULL,
  test_date DATE,
  marker_name TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  reference_low NUMERIC,
  reference_high NUMERIC,
  status TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_results_user_id ON public.lab_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_document_id ON public.lab_results(document_id);

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own lab results" ON public.lab_results;
  DROP POLICY IF EXISTS "Users can insert own lab results" ON public.lab_results;
  DROP POLICY IF EXISTS "Users can delete own lab results" ON public.lab_results;
END $$;

CREATE POLICY "Users can view own lab results"
  ON public.lab_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab results"
  ON public.lab_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lab results"
  ON public.lab_results FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Remedy Favorites Table (Phase 4)
-- ============================================

CREATE TABLE IF NOT EXISTS public.remedy_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remedy_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, remedy_slug)
);

CREATE INDEX IF NOT EXISTS idx_remedy_favorites_user_id ON public.remedy_favorites(user_id);

ALTER TABLE public.remedy_favorites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own favorites" ON public.remedy_favorites;
  DROP POLICY IF EXISTS "Users can insert own favorites" ON public.remedy_favorites;
  DROP POLICY IF EXISTS "Users can delete own favorites" ON public.remedy_favorites;
END $$;

CREATE POLICY "Users can view own favorites"
  ON public.remedy_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.remedy_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.remedy_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Wellness Score History (Phase 4)
-- ============================================

CREATE TABLE IF NOT EXISTS public.wellness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_scores_user_id ON public.wellness_scores(user_id);

ALTER TABLE public.wellness_scores ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own wellness scores" ON public.wellness_scores;
  DROP POLICY IF EXISTS "Users can insert own wellness scores" ON public.wellness_scores;
END $$;

CREATE POLICY "Users can view own wellness scores"
  ON public.wellness_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness scores"
  ON public.wellness_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Done! All Phases 1-4 schema changes applied.
-- ============================================
