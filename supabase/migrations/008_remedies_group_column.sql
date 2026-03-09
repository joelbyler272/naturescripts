-- Migration 008: Add remedy_group column for tab-based filtering
-- Groups: Herbs, Oils, Tinctures, Remedies, Food

ALTER TABLE public.remedies
  ADD COLUMN IF NOT EXISTS remedy_group TEXT NOT NULL DEFAULT 'Herbs';

CREATE INDEX IF NOT EXISTS idx_remedies_group ON public.remedies(remedy_group);

-- Backfill Herbs (default, so only need to update the others)

-- Backfill Remedies group
UPDATE public.remedies SET remedy_group = 'Remedies'
WHERE category IN (
  'Anti-inflammatory', 'Anti-Inflammatory & Pain',
  'Immune', 'Sleep', 'Digestive',
  'Digestive & Respiratory Support', 'Metabolic Support',
  'Energy', 'Energy & Adaptogens'
);

-- Backfill Food group
UPDATE public.remedies SET remedy_group = 'Food'
WHERE category IN ('Mineral', 'Amino Acid', 'Vitamin');
