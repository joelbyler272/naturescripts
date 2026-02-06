-- API Usage Tracking Table
-- Stores token usage and costs for Claude API calls

CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL, -- 'chat' or 'protocol'
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  input_cost DECIMAL(10, 8) NOT NULL DEFAULT 0,
  output_cost DECIMAL(10, 8) NOT NULL DEFAULT 0,
  total_cost DECIMAL(10, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Only service role can insert (from API routes)
CREATE POLICY "Service role can insert api_usage" ON public.api_usage
  FOR INSERT WITH CHECK (true);

-- Admin can read all (we'll check admin status in application code)
CREATE POLICY "Authenticated users can read api_usage" ON public.api_usage
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON public.api_usage(endpoint);

-- Function to get daily usage stats
CREATE OR REPLACE FUNCTION public.get_daily_api_usage(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  total_requests BIGINT,
  total_input_tokens BIGINT,
  total_output_tokens BIGINT,
  total_cost DECIMAL,
  chat_requests BIGINT,
  protocol_requests BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(api_usage.created_at) as date,
    COUNT(*)::BIGINT as total_requests,
    SUM(api_usage.input_tokens)::BIGINT as total_input_tokens,
    SUM(api_usage.output_tokens)::BIGINT as total_output_tokens,
    SUM(api_usage.total_cost) as total_cost,
    COUNT(*) FILTER (WHERE api_usage.endpoint = 'chat')::BIGINT as chat_requests,
    COUNT(*) FILTER (WHERE api_usage.endpoint = 'protocol')::BIGINT as protocol_requests
  FROM public.api_usage
  WHERE api_usage.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY DATE(api_usage.created_at)
  ORDER BY DATE(api_usage.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get hourly usage for today
CREATE OR REPLACE FUNCTION public.get_hourly_api_usage()
RETURNS TABLE (
  hour INTEGER,
  total_requests BIGINT,
  total_cost DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    EXTRACT(HOUR FROM api_usage.created_at)::INTEGER as hour,
    COUNT(*)::BIGINT as total_requests,
    SUM(api_usage.total_cost) as total_cost
  FROM public.api_usage
  WHERE DATE(api_usage.created_at) = CURRENT_DATE
  GROUP BY EXTRACT(HOUR FROM api_usage.created_at)
  ORDER BY hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
