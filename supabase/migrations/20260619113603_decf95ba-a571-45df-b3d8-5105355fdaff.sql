
-- 1) Delivery zones (Toshkent shaharlari, viloyatlar va yetkazib berish narxi)
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.delivery_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_zones TO authenticated;
GRANT ALL ON public.delivery_zones TO service_role;

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active delivery zones"
  ON public.delivery_zones FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage delivery zones"
  ON public.delivery_zones FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_delivery_zones_updated
  BEFORE UPDATE ON public.delivery_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Pet-food spetsifik maydonlar orders jadvaliga
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS pet_type TEXT,
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS delivery_city TEXT,
  ADD COLUMN IF NOT EXISTS delivery_zone_id UUID REFERENCES public.delivery_zones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS delivery_type TEXT,
  ADD COLUMN IF NOT EXISTS payment_type TEXT,
  ADD COLUMN IF NOT EXISTS recurrence TEXT;

-- 3) Mahsulot uchun ombor qoldig'i + veterinar tavsiyasi
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vet_recommended BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pet_type TEXT,
  ADD COLUMN IF NOT EXISTS package_size TEXT,
  ADD COLUMN IF NOT EXISTS food_type TEXT;
