
CREATE TABLE IF NOT EXISTS public.admin_error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  context text NOT NULL,
  message text NOT NULL,
  details jsonb,
  user_role text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_error_logs TO authenticated;
GRANT ALL ON public.admin_error_logs TO service_role;

ALTER TABLE public.admin_error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can insert own error logs"
  ON public.admin_error_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view error logs"
  ON public.admin_error_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS admin_error_logs_created_at_idx
  ON public.admin_error_logs (created_at DESC);
