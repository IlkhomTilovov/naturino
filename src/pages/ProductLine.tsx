import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Beef, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/LazyImage';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { useProductLine } from '@/hooks/useProductLines';
import { useBrandById } from '@/hooks/useBrands';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/hooks/useProducts';

export default function ProductLine() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const isUz = language === 'uz';
  const { line, loading } = useProductLine(slug);
  const { brand } = useBrandById(line?.brand_id);
  const [products, setProducts] = useState<Product[]>([]);

  const name = line ? (isUz ? line.name_uz : line.name_ru) : '';
  const tagline = line ? (isUz ? line.tagline_uz : line.tagline_ru) : '';
  const forWhom = line ? (isUz ? line.for_whom_uz : line.for_whom_ru) : '';
  const problem = line ? (isUz ? line.problem_solved_uz : line.problem_solved_ru) : '';
  const composition = line ? (isUz ? line.composition_uz : line.composition_ru) : '';
  const contraindications = line ? (isUz ? line.contraindications_uz : line.contraindications_ru) : '';
  const advantages = (line ? (isUz ? line.advantages_uz : line.advantages_ru) : []) || [];

  useSEO({
    title: (isUz ? line?.meta_title_uz : line?.meta_title_ru) || name || undefined,
    description: (isUz ? line?.meta_description_uz : line?.meta_description_ru) || tagline || undefined,
  });

  useEffect(() => {
    if (!line?.id) return;
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('product_line_id' as any, line.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setProducts((data || []) as Product[]);
    })();
  }, [line?.id]);

  if (loading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!line) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isUz ? 'Liniya topilmadi' : 'Линейка не найдена'}</h1>
          <Button asChild><Link to="/catalog">{isUz ? 'Katalogga' : 'В каталог'}</Link></Button>
        </div>
      </div>
    );
  }

  const brandName = brand ? (isUz ? brand.name_uz : brand.name_ru) : '';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative w-full min-h-[60vh] bg-muted overflow-hidden">
        {line.banner ? (
          <>
            <LazyImage src={line.banner} alt={name} priority className="w-full h-full object-cover" wrapperClassName="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        )}
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3 text-white/90 hover:bg-white/10 hover:text-white">
            <Link to={brand ? `/brand/${brand.slug}` : '/catalog'}>
              <ArrowLeft className="w-4 h-4 mr-2" />{brand ? brandName : (isUz ? 'Orqaga' : 'Назад')}
            </Link>
          </Button>
          {brand && (
            <Badge variant="outline" className="mb-3 border-white/30 text-white/90 bg-white/10 backdrop-blur">
              {brandName}
            </Badge>
          )}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-3xl">
            {name}
          </h1>
          {tagline && (
            <p className="mt-5 text-lg md:text-xl text-white/85 font-light max-w-2xl">{tagline}</p>
          )}
          {line.recommended_age && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-sm">
              <Baby className="w-4 h-4" />
              {line.recommended_age}
            </div>
          )}
        </div>
      </div>

      {/* Expert content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          {forWhom && (
            <section className="bg-card rounded-2xl p-7 border">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-serif text-2xl font-bold">{isUz ? 'Kimlar uchun' : 'Для кого'}</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{forWhom}</p>
            </section>
          )}

          {problem && (
            <section className="bg-card rounded-2xl p-7 border">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="font-serif text-2xl font-bold">{isUz ? 'Qanday muammoni hal qiladi' : 'Какую проблему решает'}</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{problem}</p>
            </section>
          )}
        </div>

        {advantages.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">{isUz ? 'Afzalliklari' : 'Преимущества'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {advantages.map((adv, i) => (
                <div key={i} className="flex items-start gap-3 bg-card rounded-xl p-5 border">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed">{adv}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {composition && (
          <section className="bg-secondary/30 rounded-2xl p-7 border">
            <div className="flex items-center gap-2 mb-3">
              <Beef className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl font-bold">{isUz ? 'Tarkib' : 'Состав'}</h2>
            </div>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{composition}</p>
          </section>
        )}

        {contraindications && (
          <section className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-7 border border-amber-200/50">
            <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-serif text-2xl font-bold">{isUz ? 'Qarshi ko‘rsatmalar' : 'Противопоказания'}</h2>
            </div>
            <p className="text-amber-900/80 dark:text-amber-100/80 whitespace-pre-line leading-relaxed">{contraindications}</p>
          </section>
        )}

        {products.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">
              {isUz ? 'Liniya mahsulotlari' : 'Товары линейки'}{' '}
              <span className="text-muted-foreground text-base font-normal">({products.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
