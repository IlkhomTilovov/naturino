
-- ============ PAGES ============
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL DEFAULT 'static',
  parent_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system BOOLEAN NOT NULL DEFAULT false,
  show_in_menu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active pages are viewable by everyone"
  ON public.pages FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pages"
  ON public.pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PAGE TRANSLATIONS ============
CREATE TABLE public.page_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_id, language_code)
);
GRANT SELECT ON public.page_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_translations TO authenticated;
GRANT ALL ON public.page_translations TO service_role;
ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page translations viewable by everyone"
  ON public.page_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage page translations"
  ON public.page_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER page_translations_updated_at BEFORE UPDATE ON public.page_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PAGE SECTIONS ============
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active sections viewable by everyone"
  ON public.page_sections FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage page sections"
  ON public.page_sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER page_sections_updated_at BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PAGE SECTION TRANSLATIONS ============
CREATE TABLE public.page_section_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.page_sections(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  heading TEXT,
  subheading TEXT,
  body TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_alt TEXT,
  custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(section_id, language_code)
);
GRANT SELECT ON public.page_section_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_section_translations TO authenticated;
GRANT ALL ON public.page_section_translations TO service_role;
ALTER TABLE public.page_section_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Section translations viewable by everyone"
  ON public.page_section_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage section translations"
  ON public.page_section_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER page_section_translations_updated_at BEFORE UPDATE ON public.page_section_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_page_translations_page ON public.page_translations(page_id, language_code);
CREATE INDEX idx_page_sections_page ON public.page_sections(page_id, sort_order);
CREATE INDEX idx_section_translations_section ON public.page_section_translations(section_id, language_code);
