-- Fix #1: Prevent users from modifying tier/stripe_customer_id on their own profile
-- Only the Stripe webhook (service role) should write these columns.

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Replace with a restricted policy that forbids changing privilege-bearing
-- columns: tier and stripe_customer_id (billing) and role (gates the
-- practitioner/admin areas — see app/(practitioner)/layout.tsx).
-- Users can update their own profile, but these values must match the row.
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND tier = (SELECT p.tier FROM public.profiles p WHERE p.id = auth.uid())
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
    AND (
      stripe_customer_id IS NOT DISTINCT FROM
      (SELECT p.stripe_customer_id FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

-- Fix #4: Remove user-writable INSERT/UPDATE on daily_usage
-- Usage counters should only be modified by the increment_daily_usage RPC (SECURITY DEFINER)

DROP POLICY IF EXISTS "Users can insert own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.daily_usage;

-- Users can still read their own usage (needed for UI display)
-- The existing SELECT policy stays in place.
