import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LanguageRow {
  id: string;
  code: string;
  name: string;
  native_name: string;
  flag: string | null;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
}

/**
 * Loads the dynamic languages from the database.
 * Returns ALL languages (active + inactive) — caller filters as needed.
 * If the table is empty or unavailable, returns an empty array so callers
 * can fall back to the hardcoded UZ/RU defaults.
 */
export function useLanguages() {
  const [languages, setLanguages] = useState<LanguageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('languages' as any)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLanguages((data as any) || []);
      setError(null);
    } catch (e: any) {
      console.error('Failed to load languages:', e);
      setError(e.message);
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const activeLanguages = languages.filter((l) => l.is_active);
  const defaultLanguage = languages.find((l) => l.is_default) || activeLanguages[0] || null;

  return {
    languages,
    activeLanguages,
    defaultLanguage,
    loading,
    error,
    refresh: fetchLanguages,
  };
}
