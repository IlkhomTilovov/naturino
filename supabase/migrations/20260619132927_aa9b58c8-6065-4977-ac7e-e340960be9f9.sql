REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

REVOKE EXECUTE ON FUNCTION public.get_public_analytics_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_analytics_stats() TO anon, authenticated, service_role;