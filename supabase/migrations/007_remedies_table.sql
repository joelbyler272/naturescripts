-- Migration 007: Remedies table for admin-managed remedy database

CREATE TABLE IF NOT EXISTS public.remedies (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  botanical_name TEXT NOT NULL DEFAULT '',
  aliases JSONB NOT NULL DEFAULT '[]',
  category TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]',
  rating NUMERIC(3,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
  summary TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  how_it_works TEXT NOT NULL DEFAULT '',
  benefits JSONB NOT NULL DEFAULT '[]',
  dosages JSONB NOT NULL DEFAULT '[]',
  best_time_to_take TEXT NOT NULL DEFAULT '',
  how_long_to_work TEXT NOT NULL DEFAULT '',
  side_effects JSONB NOT NULL DEFAULT '[]',
  who_should_avoid JSONB NOT NULL DEFAULT '[]',
  interactions JSONB NOT NULL DEFAULT '[]',
  faqs JSONB NOT NULL DEFAULT '[]',
  quality_markers JSONB NOT NULL DEFAULT '[]',
  products JSONB NOT NULL DEFAULT '[]',
  related_remedies JSONB NOT NULL DEFAULT '[]',
  often_paired_with JSONB NOT NULL DEFAULT '[]',
  last_updated TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public read access (remedies are public content)
ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Remedies are publicly readable"
  ON public.remedies FOR SELECT
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_remedies_category ON public.remedies(category);
CREATE INDEX IF NOT EXISTS idx_remedies_rating ON public.remedies(rating DESC);

-- Auto-update trigger (reuse existing function)
CREATE TRIGGER update_remedies_updated_at
  BEFORE UPDATE ON public.remedies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
