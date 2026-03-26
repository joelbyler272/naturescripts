-- Expand profiles table with full wellness intake fields
-- Supports Phase 2: Full Wellness Intake

-- Diet & Nutrition fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS food_sensitivities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS caffeine_intake TEXT,
ADD COLUMN IF NOT EXISTS sugar_consumption TEXT,
ADD COLUMN IF NOT EXISTS water_intake TEXT,
ADD COLUMN IF NOT EXISTS alcohol_use TEXT,
ADD COLUMN IF NOT EXISTS tobacco_use TEXT;

-- Lifestyle fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS exercise_frequency TEXT,
ADD COLUMN IF NOT EXISTS sunlight_exposure TEXT;

-- Mental & Emotional fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mood_patterns TEXT,
ADD COLUMN IF NOT EXISTS focus_ability INTEGER,
ADD COLUMN IF NOT EXISTS meditation_practice BOOLEAN DEFAULT false;

-- Personal fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS blood_type TEXT;

-- Track intake completion
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS intake_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS intake_completed_at TIMESTAMPTZ;

-- Comments
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

-- Update health context function to include new intake fields
CREATE OR REPLACE FUNCTION public.get_user_health_context(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_context JSONB;
BEGIN
  IF auth.uid() != p_user_id THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
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
