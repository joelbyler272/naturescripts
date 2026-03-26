-- Phase 3: Document Intelligence + Phase 4: Remedy Favorites
-- Supports document upload, lab results, and remedy bookmarking

-- ============================================
-- DOCUMENT STORAGE
-- ============================================

-- Create storage bucket for health documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'health-documents',
  'health-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can only access their own documents
CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'health-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- DOCUMENT METADATA TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'other',
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider TEXT,
  test_date DATE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  parsed_text TEXT,
  parsed_data JSONB DEFAULT '{}'::JSONB,
  ai_interpretation TEXT,
  ai_interpretation_data JSONB DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON public.user_documents(document_type);

-- RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.user_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.user_documents FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LAB RESULTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.user_documents(id) ON DELETE SET NULL,
  test_date DATE,
  marker_name TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  reference_low NUMERIC,
  reference_high NUMERIC,
  status TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_results_user_id ON public.lab_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_document_id ON public.lab_results(document_id);

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lab results"
  ON public.lab_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab results"
  ON public.lab_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lab results"
  ON public.lab_results FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REMEDY FAVORITES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.remedy_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remedy_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, remedy_slug)
);

CREATE INDEX IF NOT EXISTS idx_remedy_favorites_user_id ON public.remedy_favorites(user_id);

ALTER TABLE public.remedy_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.remedy_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.remedy_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.remedy_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- WELLNESS SCORE HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS public.wellness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_scores_user_id ON public.wellness_scores(user_id);

ALTER TABLE public.wellness_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wellness scores"
  ON public.wellness_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness scores"
  ON public.wellness_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);
