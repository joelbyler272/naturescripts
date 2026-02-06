-- NatureScripts Database Migration: Health Profile Fields
-- Run this AFTER the initial schema.sql

-- ============================================
-- ADD HEALTH CONTEXT FIELDS TO PROFILES
-- ============================================

-- Add health history fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS health_conditions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS medications JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS supplements JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS health_notes TEXT;

-- Comment on columns for documentation
COMMENT ON COLUMN public.profiles.health_conditions IS 'Array of health conditions/concerns (e.g., ["anxiety", "insomnia", "IBS"])';
COMMENT ON COLUMN public.profiles.medications IS 'Current medications with dosages: [{"name": "...", "dosage": "...", "frequency": "..."}]';
COMMENT ON COLUMN public.profiles.supplements IS 'Current supplements with dosages: [{"name": "...", "dosage": "...", "frequency": "..."}]';
COMMENT ON COLUMN public.profiles.health_notes IS 'Free-form notes about health history, allergies, etc.';

-- ============================================
-- RLS POLICIES FOR PROFILES
-- ============================================

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, tier, health_conditions, medications, supplements)
  VALUES (
    NEW.id,
    'free',
    '{}',
    '[]'::jsonb,
    '[]'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that fires when a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- HELPER FUNCTION: GET USER HEALTH CONTEXT
-- Returns all health context for a user (used in consultations)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_health_context(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_context JSONB;
BEGIN
  -- Security: verify caller is requesting their own data
  IF auth.uid() != p_user_id THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'health_conditions', COALESCE(health_conditions, '{}'),
    'medications', COALESCE(medications, '[]'),
    'supplements', COALESCE(supplements, '[]'),
    'health_notes', COALESCE(health_notes, ''),
    'tier', tier
  ) INTO v_context
  FROM public.profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(v_context, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: GET PRO USER CONSULTATION HISTORY
-- Returns past consultations and protocols for Pro users
-- ============================================
CREATE OR REPLACE FUNCTION public.get_consultation_history(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS JSONB AS $$
DECLARE
  v_history JSONB;
BEGIN
  -- Security: verify caller is requesting their own data
  IF auth.uid() != p_user_id THEN
    RETURN NULL;
  END IF;

  -- Cap limit to prevent excessive queries
  p_limit := LEAST(p_limit, 50);

  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'initial_input', initial_input,
      'protocol_summary', protocol_data->'summary',
      'recommendations', protocol_data->'recommendations',
      'created_at', created_at
    )
    ORDER BY created_at DESC
  ) INTO v_history
  FROM public.consultations
  WHERE user_id = p_user_id 
    AND status = 'completed'
    AND protocol_data IS NOT NULL
  LIMIT p_limit;
  
  RETURN COALESCE(v_history, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE!
-- This migration adds:
-- 1. Health profile columns to profiles table
-- 2. RLS policies for SELECT and UPDATE
-- 3. Trigger to auto-create profile on signup
-- 4. Helper functions for consultations
-- ============================================
