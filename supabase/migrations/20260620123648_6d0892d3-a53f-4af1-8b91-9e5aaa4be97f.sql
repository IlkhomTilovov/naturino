GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

INSERT INTO public.languages (code, name, native_name, flag, is_active, is_default, sort_order)
VALUES
  ('uz', 'Uzbek', 'O''zbekcha', '🇺🇿', true, true, 1),
  ('ru', 'Russian', 'Русский', '🇷🇺', true, false, 2),
  ('en', 'English', 'English', '🇬🇧', true, false, 3)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image text,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON public.cms_pages(status);

GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;

CREATE TABLE public.cms_page_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES public.languages(code) ON DELETE CASCADE,
  title text,
  subtitle text,
  description text,
  content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, language_code)
);
CREATE INDEX idx_cms_page_translations_page_id ON public.cms_page_translations(page_id);

GRANT SELECT ON public.cms_page_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_page_translations TO authenticated;
GRANT ALL ON public.cms_page_translations TO service_role;

CREATE TABLE public.cms_page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  block_type text NOT NULL CHECK (block_type IN ('hero', 'text', 'text_image', 'features', 'stats', 'faq', 'cta', 'gallery')),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cms_page_blocks_page_id ON public.cms_page_blocks(page_id, sort_order);

GRANT SELECT ON public.cms_page_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_page_blocks TO authenticated;
GRANT ALL ON public.cms_page_blocks TO service_role;

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published cms_pages"
  ON public.cms_pages FOR SELECT
  USING (
    status = 'published'
    OR (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins and managers can manage cms_pages"
  ON public.cms_pages FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Anyone can view translations of visible cms_pages"
  ON public.cms_page_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_pages p
      WHERE p.id = cms_page_translations.page_id
        AND (p.status = 'published' OR (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')))
    )
  );

CREATE POLICY "Admins and managers can manage cms_page_translations"
  ON public.cms_page_translations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Anyone can view blocks of visible cms_pages"
  ON public.cms_page_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_pages p
      WHERE p.id = cms_page_blocks.page_id
        AND (p.status = 'published' OR (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')))
    )
  );

CREATE POLICY "Admins and managers can manage cms_page_blocks"
  ON public.cms_page_blocks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

CREATE TRIGGER trg_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cms_page_translations_updated_at
  BEFORE UPDATE ON public.cms_page_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cms_page_blocks_updated_at
  BEFORE UPDATE ON public.cms_page_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Authenticated can read page images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'page-images');

CREATE POLICY "Admins/managers can upload page images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'page-images'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins/managers can update page images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'page-images'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  );

CREATE POLICY "Admins/managers can delete page images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'page-images'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  );

INSERT INTO public.cms_pages (title, slug, status, sort_order)
VALUES
  ('Company', 'company', 'draft', 1),
  ('Private Label', 'private-label', 'draft', 2),
  ('Quality', 'sifat', 'draft', 3),
  ('Manufacturing', 'ishlab-chiqarish', 'draft', 4),
  ('Export', 'eksport', 'draft', 5),
  ('Contact', 'contact', 'draft', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.cms_page_translations (page_id, language_code, title)
SELECT p.id, l.code, CASE
    WHEN p.slug = 'company' AND l.code = 'uz' THEN 'Kompaniya'
    WHEN p.slug = 'company' AND l.code = 'ru' THEN 'Компания'
    WHEN p.slug = 'company' AND l.code = 'en' THEN 'Company'
    WHEN p.slug = 'private-label' THEN 'Private Label'
    WHEN p.slug = 'sifat' AND l.code = 'uz' THEN 'Sifat'
    WHEN p.slug = 'sifat' AND l.code = 'ru' THEN 'Качество'
    WHEN p.slug = 'sifat' AND l.code = 'en' THEN 'Quality'
    WHEN p.slug = 'ishlab-chiqarish' AND l.code = 'uz' THEN 'Ishlab chiqarish'
    WHEN p.slug = 'ishlab-chiqarish' AND l.code = 'ru' THEN 'Производство'
    WHEN p.slug = 'ishlab-chiqarish' AND l.code = 'en' THEN 'Manufacturing'
    WHEN p.slug = 'eksport' AND l.code = 'uz' THEN 'Eksport'
    WHEN p.slug = 'eksport' AND l.code = 'ru' THEN 'Экспорт'
    WHEN p.slug = 'eksport' AND l.code = 'en' THEN 'Export'
    WHEN p.slug = 'contact' AND l.code = 'uz' THEN 'Aloqa'
    WHEN p.slug = 'contact' AND l.code = 'ru' THEN 'Контакты'
    WHEN p.slug = 'contact' AND l.code = 'en' THEN 'Contact'
  END
FROM public.cms_pages p
CROSS JOIN public.languages l
WHERE p.slug IN ('company', 'private-label', 'sifat', 'ishlab-chiqarish', 'eksport', 'contact')
  AND l.code IN ('uz', 'ru', 'en')
ON CONFLICT (page_id, language_code) DO NOTHING;