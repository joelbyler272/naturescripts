-- Fix TOCTOU race: merge check + increment into one atomic operation.
-- Previously check_can_consult read the count, then increment_daily_usage
-- bumped it separately -- concurrent requests could both pass the check.

CREATE OR REPLACE FUNCTION public.increment_daily_usage(p_user_id UUID)
RETURNS TABLE(consultation_count INTEGER, can_consult BOOLEAN) AS $$
DECLARE
  v_weekly_count INTEGER;
  v_tier TEXT;
  v_limit INTEGER;
  v_week_start DATE;
BEGIN
  SELECT tier INTO v_tier FROM public.profiles WHERE id = p_user_id;
  v_limit := CASE WHEN v_tier = 'pro' THEN 999999 ELSE 5 END;

  v_week_start := date_trunc('week', CURRENT_DATE)::date;

  -- Get current weekly count BEFORE incrementing
  SELECT COALESCE(SUM(du.consultation_count), 0) INTO v_weekly_count
  FROM public.daily_usage du
  WHERE du.user_id = p_user_id AND du.date >= v_week_start;

  -- Reject if already at or over the limit
  IF v_weekly_count >= v_limit THEN
    RETURN QUERY SELECT v_weekly_count, false;
    RETURN;
  END IF;

  -- Under the limit -- increment
  INSERT INTO public.daily_usage (user_id, date, consultation_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    consultation_count = daily_usage.consultation_count + 1,
    updated_at = NOW();

  -- Re-read the weekly total (now includes the increment)
  SELECT COALESCE(SUM(du.consultation_count), 0) INTO v_weekly_count
  FROM public.daily_usage du
  WHERE du.user_id = p_user_id AND du.date >= v_week_start;

  RETURN QUERY SELECT v_weekly_count, true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
