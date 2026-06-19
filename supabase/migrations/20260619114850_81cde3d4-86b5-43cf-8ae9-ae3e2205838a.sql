
-- 1. Drop overly-broad product-images storage policies (keep admin/editor-scoped ones)
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- 2. Tighten order_items INSERT: must reference an existing order in 'new' status
DROP POLICY IF EXISTS "Public can create order_items" ON public.order_items;
CREATE POLICY "Public can create order_items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    quantity >= 1
    AND quantity <= 100
    AND length(btrim(product_id)) > 0
    AND length(btrim(product_name_snapshot)) > 0
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND o.status = 'new'
        AND o.created_at > now() - interval '1 hour'
    )
  );

-- 3. Revoke EXECUTE on internal trigger / utility SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ensure_single_active_theme() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_sitemap_regeneration() FROM PUBLIC, anon, authenticated;

-- 4. Disable file listing on public storage buckets (public URL access still works)
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
DROP POLICY IF EXISTS "Brand images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can read sitemap" ON storage.objects;

-- 5. Replace `WITH CHECK (true)` with concrete validation
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.site_analytics_events;
CREATE POLICY "Anyone can insert analytics events"
  ON public.site_analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(event_name)) > 0
    AND length(event_name) <= 100
    AND length(btrim(session_id)) > 0
    AND length(session_id) <= 200
  );

DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 2 AND 120
    AND length(btrim(phone)) BETWEEN 4 AND 40
    AND length(btrim(message)) BETWEEN 2 AND 4000
  );
