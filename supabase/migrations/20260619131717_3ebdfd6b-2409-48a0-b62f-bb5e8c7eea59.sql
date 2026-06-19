
DROP POLICY IF EXISTS "Staff can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete brand images" ON storage.objects;

CREATE POLICY "Authenticated can upload product images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated can update product images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated can delete product images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated can upload brand images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'brand-images');

CREATE POLICY "Authenticated can update brand images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'brand-images');

CREATE POLICY "Authenticated can delete brand images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'brand-images');
