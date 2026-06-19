import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCategories } from '@/hooks/useProducts';
import { EditableText } from '@/components/EditableText';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          o.disconnect();
        }
      },
      { threshold }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return { ref, isVisible: v };
}

export const ShopByCategoriesSection = memo(function ShopByCategoriesSection() {
  const { language } = useLanguage();
  const { ref, isVisible } = useInView();
  const { categories, loading } = useCategories();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const t = (uz: string, ru: string) => (language === 'ru' ? ru : uz);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section
      ref={ref}
      className="py-20 lg:py-32 bg-background border-t border-border/60"
      aria-labelledby="shop-categories-title"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* CAROUSEL */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[80vh] w-full rounded-none" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {t('Kategoriyalar mavjud emas', 'Категории отсутствуют')}
            </div>
          ) : (
            <>
              <Carousel
                setApi={setApi}
                opts={{ align: 'start', loop: categories.length > 1 }}
                className="w-full"
              >
                <CarouselContent className="-ml-0">
                  {categories.map((cat, i) => {
                    const name = language === 'ru' ? cat.name_ru : cat.name_uz;
                    const number = String(i + 1).padStart(2, '0');
                    return (
                      <CarouselItem
                        key={cat.id}
                        className="pl-0 basis-full"
                      >
                        <Link
                          to={`/catalog?category=${cat.slug}`}
                          className="group block relative overflow-hidden h-[80vh] bg-secondary"
                          aria-label={name}
                        >
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                          {/* Content */}
                          <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 text-white">
                            <div className="flex items-start justify-between">
                              <span className="text-xs tracking-[0.3em] uppercase opacity-80">
                                {t('KATEGORIYA', 'КАТЕГОРИЯ')} {number}
                              </span>
                              <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                                <ArrowUpRight className="w-4 h-4" />
                              </span>
                            </div>

                            <div>
                              <h3 className="font-serif text-3xl lg:text-4xl xl:text-5xl leading-[1.05] mb-3">
                                {name}
                              </h3>
                              <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white/90 group-hover:gap-3 transition-all">
                                {t("KO'RISH", 'СМОТРЕТЬ')}
                                <ArrowUpRight className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>

              {/* Progress + mobile dots */}
              <div className="flex items-center justify-between mt-8 gap-6">
                <div className="flex-1 h-px bg-border relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                    style={{
                      width: count > 0 ? `${((current + 1) / count) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground tabular-nums">
                  {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>

                {/* Mobile controls */}
                <div className="flex md:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={() => api?.scrollPrev()}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
                    aria-label={t('Oldingi', 'Назад')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => api?.scrollNext()}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center"
                    aria-label={t('Keyingi', 'Далее')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
});
