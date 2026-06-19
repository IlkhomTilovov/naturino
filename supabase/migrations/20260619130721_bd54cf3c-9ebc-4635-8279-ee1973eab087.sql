
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
CREATE POLICY "Staff can manage site content" ON public.site_content
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor') OR has_role(auth.uid(), 'manager'));
