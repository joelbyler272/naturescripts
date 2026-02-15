-- NatureScripts Database Migration: Onboarding & Account Management
-- Run this AFTER 001_health_profile_fields.sql

-- ============================================
-- ADD ONBOARDING TRACKING TO PROFILES
-- ============================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether user has completed onboarding consultation';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS 'When onboarding was completed';

-- ============================================
-- ACCOUNT DELETION FUNCTION
-- Allows users to delete their own account and all data
--
-- IMPORTANT: When adding new tables with user_id foreign keys,
-- add corresponding DELETE statements here to avoid orphaned data.
-- Current tables: consultations, daily_usage, profiles
--
-- NOTE: The auth.users record must be deleted via Supabase admin API
-- (handled in app/api/account/delete/route.ts). This function only
-- deletes application data.
-- ============================================

CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Security: verify caller is authenticated and deleting their own account
  -- Using IS DISTINCT FROM to handle NULL auth.uid() safely
  IF auth.uid() IS NULL OR auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: can only delete your own account';
  END IF;

  -- Delete user's consultations
  DELETE FROM public.consultations WHERE user_id = p_user_id;

  -- Delete user's daily usage records
  DELETE FROM public.daily_usage WHERE user_id = p_user_id;

  -- Delete user's profile
  DELETE FROM public.profiles WHERE id = p_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account(UUID) TO authenticated;

-- ============================================
-- DAILY USAGE INCREMENT FUNCTION
-- Properly increments consultation_count on conflict
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_daily_usage(p_user_id UUID)
RETURNS TABLE(consultation_count INTEGER, can_consult BOOLEAN) AS $$
DECLARE
  v_count INTEGER;
  v_tier TEXT;
  v_limit INTEGER;
BEGIN
  -- Get user's tier
  SELECT tier INTO v_tier FROM public.profiles WHERE id = p_user_id;

  -- Set limit based on tier (pro = unlimited represented as 999999)
  v_limit := CASE WHEN v_tier = 'pro' THEN 999999 ELSE 3 END;

  -- Upsert daily usage
  INSERT INTO public.daily_usage (user_id, date, consultation_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    consultation_count = daily_usage.consultation_count + 1,
    updated_at = NOW()
  RETURNING daily_usage.consultation_count INTO v_count;

  RETURN QUERY SELECT v_count, v_count <= v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_daily_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_daily_usage(UUID) TO service_role;

-- ============================================
-- RLS POLICIES FOR DELETE OPERATIONS
-- ============================================

-- Allow users to delete their own consultations
DROP POLICY IF EXISTS "Users can delete own consultations" ON public.consultations;
CREATE POLICY "Users can delete own consultations"
ON public.consultations
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own daily usage
DROP POLICY IF EXISTS "Users can delete own daily_usage" ON public.daily_usage;
CREATE POLICY "Users can delete own daily_usage"
ON public.daily_usage
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own profile
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- ============================================
-- DONE!
-- ============================================
