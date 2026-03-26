-- Expand profiles table with personal health information
-- Supports Phase 1.3: Enhanced Profile Fields

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

-- Comments for documentation
COMMENT ON COLUMN public.profiles.age IS 'User age in years';
COMMENT ON COLUMN public.profiles.gender IS 'male, female, non-binary, prefer-not-to-say';
COMMENT ON COLUMN public.profiles.height_cm IS 'Height in centimeters';
COMMENT ON COLUMN public.profiles.weight_kg IS 'Weight in kilograms';
COMMENT ON COLUMN public.profiles.activity_level IS 'sedentary, light, moderate, active, very-active';
COMMENT ON COLUMN public.profiles.sleep_hours IS 'Average nightly sleep in hours';
COMMENT ON COLUMN public.profiles.stress_level IS 'Self-reported stress 1-10';
COMMENT ON COLUMN public.profiles.diet_type IS 'omnivore, vegetarian, vegan, keto, paleo, other';
COMMENT ON COLUMN public.profiles.wellness_goals IS 'Array of wellness goals';

-- Update health context function to include new fields
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
    'age', age,
    'gender', gender,
    'height_cm', height_cm,
    'weight_kg', weight_kg,
    'activity_level', activity_level,
    'sleep_hours', sleep_hours,
    'stress_level', stress_level,
    'diet_type', diet_type,
    'wellness_goals', COALESCE(wellness_goals, '{}')
  ) INTO v_context
  FROM public.profiles
  WHERE id = p_user_id;

  RETURN COALESCE(v_context, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
