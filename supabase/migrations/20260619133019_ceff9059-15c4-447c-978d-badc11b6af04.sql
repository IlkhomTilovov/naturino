CREATE POLICY "Anyone can read analytics for public stats"
ON public.site_analytics_events
FOR SELECT
TO anon, authenticated
USING (true);

ALTER FUNCTION public.get_public_analytics_stats() SECURITY INVOKER;