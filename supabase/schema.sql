-- NatureScripts Database Schema
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- ============================================
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 2. CONSULTATIONS TABLE
-- Stores user consultation history and protocols
-- ============================================
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  initial_input TEXT NOT NULL,
  conversation_log JSONB NOT NULL DEFAULT '[]',
  protocol_data JSONB,
  protocol_version INTEGER NOT NULL DEFAULT 1,
  parent_consultation_id UUID REFERENCES public.consultations(id),
  tier_at_creation TEXT NOT NULL DEFAULT 'free' CHECK (tier_at_creation IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Consultations policies: users can only see/manage their own
CREATE POLICY "Users can view own consultations" ON public.consultations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consultations" ON public.consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations" ON public.consultations
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);


-- ============================================
-- 3. DAILY_USAGE TABLE
-- Tracks consultation count per day (for free tier limits)
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  consultation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- Daily usage policies
CREATE POLICY "Users can view own usage" ON public.daily_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.daily_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.daily_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);


-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to get or create today's usage record and increment
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

-- Function to check if user can start a consultation
CREATE OR REPLACE FUNCTION public.check_can_consult(p_user_id UUID)
RETURNS TABLE(can_consult BOOLEAN, current_count INTEGER, daily_limit INTEGER, tier TEXT) AS $$
DECLARE
  v_count INTEGER;
  v_tier TEXT;
  v_limit INTEGER;
BEGIN
  -- Get user's tier
  SELECT profiles.tier INTO v_tier FROM public.profiles WHERE id = p_user_id;
  
  -- Default to free if no profile found
  v_tier := COALESCE(v_tier, 'free');
  
  -- Set limit based on tier
  v_limit := CASE WHEN v_tier = 'pro' THEN 999999 ELSE 3 END;
  
  -- Get today's count
  SELECT COALESCE(daily_usage.consultation_count, 0) INTO v_count
  FROM public.daily_usage
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  v_count := COALESCE(v_count, 0);
  
  RETURN QUERY SELECT v_count < v_limit, v_count, v_limit, v_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 5. UPDATED_AT TRIGGER
-- Automatically updates updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_daily_usage_updated_at ON public.daily_usage;
CREATE TRIGGER update_daily_usage_updated_at
  BEFORE UPDATE ON public.daily_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================
-- DONE! 
-- Your database is now set up for NatureScripts
-- ============================================
