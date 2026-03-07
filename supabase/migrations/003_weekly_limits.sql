-- Migration: Change consultation limits from daily (3/day) to weekly (5/week)
-- The daily_usage table is reused — we still track per-day records for granularity.
-- The check/increment functions now sum across the ISO week (Monday–Sunday).

-- Update check_can_consult to use weekly sum
CREATE OR REPLACE FUNCTION public.check_can_consult(p_user_id UUID)
RETURNS TABLE(can_consult BOOLEAN, current_count INTEGER, weekly_limit INTEGER, tier TEXT) AS $$
DECLARE
  v_count INTEGER;
  v_tier TEXT;
  v_limit INTEGER;
  v_week_start DATE;
BEGIN
  -- Get user's tier
  SELECT profiles.tier INTO v_tier FROM public.profiles WHERE id = p_user_id;

  -- Default to free if no profile found
  v_tier := COALESCE(v_tier, 'free');

  -- Set limit based on tier (pro = unlimited represented as 999999)
  v_limit := CASE WHEN v_tier = 'pro' THEN 999999 ELSE 5 END;

  -- Calculate start of ISO week (Monday)
  v_week_start := date_trunc('week', CURRENT_DATE)::date;

  -- Get this week's total count
  SELECT COALESCE(SUM(daily_usage.consultation_count), 0) INTO v_count
  FROM public.daily_usage
  WHERE user_id = p_user_id AND date >= v_week_start;

  RETURN QUERY SELECT v_count < v_limit, v_count, v_limit, v_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update increment_daily_usage to check weekly limit
CREATE OR REPLACE FUNCTION public.increment_daily_usage(p_user_id UUID)
RETURNS TABLE(consultation_count INTEGER, can_consult BOOLEAN) AS $$
DECLARE
  v_weekly_count INTEGER;
  v_tier TEXT;
  v_limit INTEGER;
  v_week_start DATE;
BEGIN
  -- Get user's tier
  SELECT tier INTO v_tier FROM public.profiles WHERE id = p_user_id;

  -- Set limit based on tier (pro = unlimited represented as 999999)
  v_limit := CASE WHEN v_tier = 'pro' THEN 999999 ELSE 5 END;

  -- Upsert today's daily usage (still track per-day for granularity)
  INSERT INTO public.daily_usage (user_id, date, consultation_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    consultation_count = daily_usage.consultation_count + 1,
    updated_at = NOW();

  -- Calculate start of ISO week (Monday)
  v_week_start := date_trunc('week', CURRENT_DATE)::date;

  -- Get this week's total count (including the just-incremented row)
  SELECT COALESCE(SUM(du.consultation_count), 0) INTO v_weekly_count
  FROM public.daily_usage du
  WHERE du.user_id = p_user_id AND du.date >= v_week_start;

  RETURN QUERY SELECT v_weekly_count, v_weekly_count <= v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The return column name changed from daily_limit to weekly_limit in check_can_consult.
-- The client code needs to be updated to read `weekly_limit` instead of `daily_limit`.
