import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { translations, Language as LegacyLanguage } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';

export type Language = string; // dynamic — was 'uz' | 'ru'

export interface AvailableLanguage {
  code: string;
  name: string;
  native_name: string;
  flag: string | null;
  is_default: boolean;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['uz'];
  availableLanguages: AvailableLanguage[];
  defaultLanguage: string;
}

const FALLBACK_LANGUAGES: AvailableLanguage[] = [
  { code: 'uz', name: 'Uzbek', native_name: "O'zbekcha", flag: '🇺🇿', is_default: true },
  { code: 'ru', name: 'Russian', native_name: 'Русский', flag: '🇷🇺', is_default: false },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'furniture-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'uz';
  });

  const [availableLanguages, setAvailableLanguages] = useState<AvailableLanguage[]>(FALLBACK_LANGUAGES);

  // Load dynamic languages from DB; fallback to UZ/RU if table empty or unreachable
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('languages' as any)
          .select('code, name, native_name, flag, is_default, is_active, sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (cancelled) return;
        if (error) throw error;

        const rows = (data as any[]) || [];
        if (rows.length > 0) {
          setAvailableLanguages(
            rows.map((r) => ({
              code: r.code,
              name: r.name,
              native_name: r.native_name,
              flag: r.flag,
              is_default: !!r.is_default,
            })),
          );
        }
        // if no rows, keep fallback
      } catch (e) {
        console.warn('useLanguage: falling back to default languages', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultLanguage = useMemo(
    () => availableLanguages.find((l) => l.is_default)?.code || availableLanguages[0]?.code || 'uz',
    [availableLanguages],
  );

  // If currently selected language is not in available list, fall back to default
  useEffect(() => {
    if (availableLanguages.length === 0) return;
    if (!availableLanguages.some((l) => l.code === language)) {
      setLanguageState(defaultLanguage);
      localStorage.setItem(STORAGE_KEY, defaultLanguage);
    }
  }, [availableLanguages, language, defaultLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Translations: pick selected language if we have a static dictionary for it,
  // otherwise fall back to default → uz. Custom languages without a dictionary
  // currently inherit UZ strings (Stage 2 will replace this with DB translations).
  const t = useMemo(() => {
    const dict = (translations as any)[language] || (translations as any)[defaultLanguage] || translations.uz;
    return dict as typeof translations['uz'];
  }, [language, defaultLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages, defaultLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Re-export for backward compat
export type { LegacyLanguage };
