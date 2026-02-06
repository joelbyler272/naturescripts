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
-- ============================================

CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Security: verify caller is deleting their own account
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: can only delete your own account';
  END IF;

  -- Delete user's consultations
  DELETE FROM public.consultations WHERE user_id = p_user_id;
  
  -- Delete user's daily usage records
  DELETE FROM public.daily_usage WHERE user_id = p_user_id;
  
  -- Delete user's profile
  DELETE FROM public.profiles WHERE id = p_user_id;
  
  -- Note: The auth.users record deletion must be handled separately
  -- via Supabase admin API or the user can be marked for deletion
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account(UUID) TO authenticated;

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
