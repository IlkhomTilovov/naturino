import { useEffect, useRef, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useBrands } from '@/hooks/useBrands';
import { useLanguage } from '@/hooks/useLanguage';
import { EditableText } from '@/components/EditableText';
import { LazyImage } from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

export const BrandsSection = memo(function BrandsSection() {
  const { language } = useLanguage();
  const { brands, loading } = useBrands(true);
  const { ref, isVisible } = useInView();
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });

  useEffect(() => {
    if (brands.length === 0) return;
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('brand_id')
        .eq('is_active', true)
        .in('brand_id', brands.map((b) => b.id));
      if (!data) return;
      const counts: Record<string, number> = {};
      data.forEach((p: any) => {
        if (p.brand_id) counts[p.brand_id] = (counts[p.brand_id] || 0) + 1;
      });
      setProductCounts(counts);
    })();
  }, [brands]);

  if (!loading && brands.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-20 lg:py-32 bg-background border-t border-border/60"
      aria-labelledby="brands-section-title"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Editorial header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 lg:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-2xl">
            <EditableText
              contentKey="brands_label"
              fallback={language === 'ru' ? 'БРЕНДЫ' : 'BRENDLAR'}
              as="span"
              className="text-primary text-xs tracking-[0.3em] uppercase font-medium"
              section="brands"
            />
            <h2
              id="brands-section-title"
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground mt-4"
            >
              <EditableText
                contentKey="brands_title"
                fallback={language === 'ru' ? 'Наши бренды' : 'Bizning brendlarimiz'}
                as="span"
                section="brands"
              />
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm md:text-right">
            <EditableText
              contentKey="brands_subtitle"
              fallback={
                language === 'ru'
                  ? 'Премиальные бренды, которым мы доверяем — официальные поставки и гарантия качества.'
                  : "Biz ishonadigan premium brendlar — rasmiy yetkazib berish va sifat kafolati."
              }
              as="span"
              section="brands"
            />
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-background p-8 min-h-[280px]">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {brands.map((brand, i) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                count={productCounts[brand.id] || 0}
                language={language}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

interface BrandCardProps {
  brand: any;
  count: number;
  language: 'uz' | 'ru';
  index: number;
  isVisible: boolean;
}

const BrandCard = memo(function BrandCard({ brand, count, language, index, isVisible }: BrandCardProps) {
  const name = language === 'uz' ? brand.name_uz : brand.name_ru;
  const description = language === 'uz' ? brand.description_uz : brand.description_ru;
  const ctaLabel = language === 'ru' ? 'Смотреть бренд' : "Brendni ko'rish";
  const productsLabel = language === 'ru' ? 'товаров' : 'mahsulot';
  const monogram = (name || '').trim().charAt(0).toUpperCase();

  return (
    <Link
      to={`/brand/${brand.slug}`}
      className={`group relative bg-background p-8 lg:p-10 flex flex-col min-h-[340px] hover:bg-secondary/40 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
      aria-label={name}
    >
      {/* Top row: index + count */}
      <div className="flex items-start justify-between mb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        {count > 0 && (
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            {count} {productsLabel}
          </span>
        )}
      </div>

      {/* Logo or serif monogram */}
      <div className="mb-8 flex items-end h-20">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={`${name} logo`}
            className="h-16 w-auto max-w-[180px] object-contain object-left grayscale group-hover:grayscale-0 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <span className="font-serif text-6xl leading-none text-foreground/15 group-hover:text-primary/40 transition-colors duration-500">
            {monogram || <Award className="w-12 h-12" />}
          </span>
        )}
      </div>

      {/* Brand name */}
      <h3 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-3">
        {name}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>
      )}

      {/* CTA */}
      <span className="mt-auto inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground group-hover:gap-3 group-hover:text-primary transition-all">
        {ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </span>

      {/* Underline accent on hover */}
      <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
    </Link>
  );
});
