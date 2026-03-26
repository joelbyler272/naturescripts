-- Add pharmaceutical equivalents column to remedies table
-- Stores herb-to-drug comparisons, e.g. Turmeric -> NSAIDs (ibuprofen)
ALTER TABLE public.remedies
ADD COLUMN IF NOT EXISTS pharmaceutical_equivalents JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.remedies.pharmaceutical_equivalents IS 'Array of {drug, drugClass, mechanism} objects showing pharmaceutical comparisons';
