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

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON public.api_usage
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON public.api_usage(endpoint);
