
-- Extend brands with expert content fields
ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS manufacturer TEXT,
  ADD COLUMN IF NOT EXISTS founded_year INTEGER,
  ADD COLUMN IF NOT EXISTS segment TEXT,
  ADD COLUMN IF NOT EXISTS for_whom_uz TEXT,
  ADD COLUMN IF NOT EXISTS for_whom_ru TEXT,
  ADD COLUMN IF NOT EXISTS advantages_uz JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS advantages_ru JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_ingredients_uz TEXT,
  ADD COLUMN IF NOT EXISTS key_ingredients_ru TEXT,
  ADD COLUMN IF NOT EXISTS vet_recommendation_uz TEXT,
  ADD COLUMN IF NOT EXISTS vet_recommendation_ru TEXT,
  ADD COLUMN IF NOT EXISTS naturino_note_uz TEXT,
  ADD COLUMN IF NOT EXISTS naturino_note_ru TEXT,
  ADD COLUMN IF NOT EXISTS history_uz TEXT,
  ADD COLUMN IF NOT EXISTS history_ru TEXT;

-- New product_lines table
CREATE TABLE IF NOT EXISTS public.product_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  tagline_uz TEXT,
  tagline_ru TEXT,
  for_whom_uz TEXT,
  for_whom_ru TEXT,
  problem_solved_uz TEXT,
  problem_solved_ru TEXT,
  composition_uz TEXT,
  composition_ru TEXT,
  advantages_uz JSONB DEFAULT '[]'::jsonb,
  advantages_ru JSONB DEFAULT '[]'::jsonb,
  recommended_age TEXT,
  contraindications_uz TEXT,
  contraindications_ru TEXT,
  banner TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  meta_title_uz TEXT,
  meta_title_ru TEXT,
  meta_description_uz TEXT,
  meta_description_ru TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_lines TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_lines TO authenticated;
GRANT ALL ON public.product_lines TO service_role;

ALTER TABLE public.product_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active product lines"
  ON public.product_lines FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage product lines"
  ON public.product_lines FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_product_lines_updated_at
  BEFORE UPDATE ON public.product_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link products to product lines
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_line_id UUID REFERENCES public.product_lines(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_product_line_id ON public.products(product_line_id);
CREATE INDEX IF NOT EXISTS idx_product_lines_brand_id ON public.product_lines(brand_id);
