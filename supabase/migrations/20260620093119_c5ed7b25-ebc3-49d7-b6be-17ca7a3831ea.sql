
-- Languages table for dynamic multilingual support
CREATE TABLE public.languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  native_name text NOT NULL,
  flag text,
  is_active boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Lowercase code for consistency
CREATE OR REPLACE FUNCTION public.normalize_language_code()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.code := lower(trim(NEW.code));
  RETURN NEW;
END;
$$;

CREATE TRIGGER languages_normalize_code
BEFORE INSERT OR UPDATE ON public.languages
FOR EACH ROW EXECUTE FUNCTION public.normalize_language_code();

-- Ensure only one default language
CREATE OR REPLACE FUNCTION public.ensure_single_default_language()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.languages SET is_default = false WHERE id <> NEW.id AND is_default = true;
    -- Default must be active
    NEW.is_active := true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER languages_single_default
BEFORE INSERT OR UPDATE ON public.languages
FOR EACH ROW EXECUTE FUNCTION public.ensure_single_default_language();

-- updated_at trigger
CREATE TRIGGER languages_updated_at
BEFORE UPDATE ON public.languages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grants
GRANT SELECT ON public.languages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.languages TO authenticated;
GRANT ALL ON public.languages TO service_role;

-- RLS
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view languages"
ON public.languages FOR SELECT
USING (true);

CREATE POLICY "Admins can insert languages"
ON public.languages FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update languages"
ON public.languages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete languages"
ON public.languages FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
