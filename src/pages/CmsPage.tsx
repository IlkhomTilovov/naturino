import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { Badge } from '@/components/ui/badge';
import { PageBlockRenderer } from '@/components/cms/PageBlockRenderer';
import type { BlockType } from '@/lib/pageBuilder';
import NotFound from './NotFound';

interface PageData {
  id: string;
  title: string;
  status: 'draft' | 'published';
  featured_image: string | null;
}

interface TranslationData {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content: string | null;
}

interface BlockData {
  id: string;
  block_type: BlockType;
  data: any;
}

export default function CmsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, defaultLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState<PageData | null>(null);
  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const { data: pageRow, error } = await supabase
          .from('cms_pages' as any)
          .select('id, title, status, featured_image')
          .eq('slug', slug)
          .maybeSingle();
        if (error) throw error;
        if (!pageRow) { if (!cancelled) setNotFound(true); return; }

        const [{ data: trs }, { data: blockRows }] = await Promise.all([
          supabase.from('cms_page_translations' as any).select('language_code, title, subtitle, description, content').eq('page_id', (pageRow as any).id),
          supabase.from('cms_page_blocks' as any).select('id, block_type, data').eq('page_id', (pageRow as any).id).eq('is_active', true).order('sort_order', { ascending: true }),
        ]);

        if (cancelled) return;
        setPage(pageRow as any);
        const trRows = (trs as any[]) || [];
        const match = trRows.find((t) => t.language_code === language) || trRows.find((t) => t.language_code === defaultLanguage) || trRows[0] || null;
        setTranslation(match);
        setBlocks((blockRows as any) || []);
      } catch (err) {
        console.error('Failed to load CMS page:', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, language, defaultLanguage]);

  useSEO({ title: translation?.title || page?.title });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !page) return <NotFound />;

  return (
    <div className="min-h-screen">
      {page.status === 'draft' && (
        <div className="bg-amber-50 border-b border-amber-200 py-2 text-center">
          <Badge variant="outline" className="border-amber-400 text-amber-700">Qoralama — faqat administratorlarga ko'rinadi</Badge>
        </div>
      )}

      {(translation?.title || translation?.description || translation?.content) && (
        <section className="py-16 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            {translation?.title && <h1 className="font-serif text-4xl font-bold mb-3">{translation.title}</h1>}
            {translation?.subtitle && <p className="text-lg text-muted-foreground mb-2">{translation.subtitle}</p>}
            {translation?.description && <p className="text-muted-foreground">{translation.description}</p>}
            {translation?.content && (
              <div className="prose prose-neutral mx-auto mt-6 text-left"><ReactMarkdown>{translation.content}</ReactMarkdown></div>
            )}
          </div>
        </section>
      )}

      {blocks.map((block) => (
        <PageBlockRenderer key={block.id} blockType={block.block_type} data={block.data} lang={language} defaultLang={defaultLanguage} />
      ))}
    </div>
  );
}
