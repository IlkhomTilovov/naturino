
CREATE POLICY "Public can upload product images TEMP" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id IN ('product-images', 'brand-images'));

CREATE POLICY "Public can update product images TEMP" ON storage.objects
FOR UPDATE TO anon, authenticated
USING (bucket_id IN ('product-images', 'brand-images'));
