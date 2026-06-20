
-- Fix 1: Remove public SELECT on site_analytics_events
DROP POLICY IF EXISTS "Anyone can read analytics for public stats" ON public.site_analytics_events;

-- Fix 2: Restrict product-images and brand-images storage writes to admin/editor/manager roles
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete brand images" ON storage.objects;

CREATE POLICY "Admins/managers can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);

CREATE POLICY "Admins/managers can update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);

CREATE POLICY "Admins/managers can delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);

CREATE POLICY "Admins/managers can upload brand images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'brand-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);

CREATE POLICY "Admins/managers can update brand images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'brand-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);

CREATE POLICY "Admins/managers can delete brand images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'brand-images'
  AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);
