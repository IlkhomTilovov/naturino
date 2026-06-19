
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Staff can upload product images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager')
));

CREATE POLICY "Staff can update product images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager')
));

CREATE POLICY "Staff can delete product images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager')
));

DROP POLICY IF EXISTS "Admins/editors can upload brand images" ON storage.objects;
DROP POLICY IF EXISTS "Admins/editors can update brand images" ON storage.objects;
DROP POLICY IF EXISTS "Admins/editors can delete brand images" ON storage.objects;

CREATE POLICY "Staff can upload brand images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'brand-images' AND (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager')
));

CREATE POLICY "Staff can update brand images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'brand-images' AND (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager')
));

CREATE POLICY "Staff can delete brand images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'brand-images' AND (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager')
));
