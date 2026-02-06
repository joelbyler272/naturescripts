-- Rollback migration for 001_health_profile_fields.sql

DROP FUNCTION IF EXISTS public.get_consultation_history(UUID, INTEGER);
DROP FUNCTION IF EXISTS public.get_user_health_context(UUID);

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS health_notes,
  DROP COLUMN IF EXISTS supplements,
  DROP COLUMN IF EXISTS medications,
  DROP COLUMN IF EXISTS health_conditions;
