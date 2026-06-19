import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductLine {
  id: string;
  brand_id: string | null;
  slug: string;
  name_uz: string;
  name_ru: string;
  tagline_uz: string | null;
  tagline_ru: string | null;
  for_whom_uz: string | null;
  for_whom_ru: string | null;
  problem_solved_uz: string | null;
  problem_solved_ru: string | null;
  composition_uz: string | null;
  composition_ru: string | null;
  advantages_uz: string[] | null;
  advantages_ru: string[] | null;
  recommended_age: string | null;
  contraindications_uz: string | null;
  contraindications_ru: string | null;
  banner: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title_uz: string | null;
  meta_title_ru: string | null;
  meta_description_uz: string | null;
  meta_description_ru: string | null;
}

const TABLE = 'product_lines' as any;

export function useProductLines(brandId?: string | null) {
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q: any = (supabase as any).from(TABLE).select('*').eq('is_active', true).order('sort_order');
      if (brandId) q = q.eq('brand_id', brandId);
      const { data } = await q;
      if (!cancelled) {
        setLines((data || []) as ProductLine[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [brandId]);

  return { lines, loading };
}

export function useProductLine(slug: string | undefined) {
  const [line, setLine] = useState<ProductLine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from(TABLE)
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      setLine((data as ProductLine) || null);
      setLoading(false);
    })();
  }, [slug]);

  return { line, loading };
}
