import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

import catImg from '@/assets/naturino-cat.jpg';
import puppyImg from '@/assets/naturino-puppy.jpg';
import productImg from '@/assets/naturino-product.jpg';
import ingredientsImg from '@/assets/naturino-ingredients.jpg';
import vetImg from '@/assets/naturino-vet.jpg';
import lifestyleImg from '@/assets/naturino-lifestyle.jpg';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold });
    o.observe(el); return () => o.disconnect();
  }, [threshold]);
  return { ref, isVisible: v };
}

export const ShopByCategoriesSection = memo(function ShopByCategoriesSection() {
  const { language } = useLanguage();
  const { ref, isVisible } = useInView();

  const t = (uz: string, ru: string) => (language === 'ru' ? ru : uz);

  const foodTypes = [
    {
      key: 'cat_dry',
      slug: 'quruq-ozuqa',
      titleUz: 'Quruq ozuqa', titleRu: 'Сухой корм',
      descUz: 'Har kunlik to\'liq qiymatli ratsion',
      descRu: 'Полноценный ежедневный рацион',
      image: productImg,
    },
    {
      key: 'cat_wet',
      slug: 'nam-ozuqa',
      titleUz: 'Nam ozuqa', titleRu: 'Влажный корм',
      descUz: 'Sous va jeleyli paketchalar',
      descRu: 'Паучи в соусе и желе',
      image: ingredientsImg,
    },
    {
      key: 'cat_vet',
      slug: 'veterinar-ozuqa',
      titleUz: 'Veterinar ozuqa', titleRu: 'Ветеринарный корм',
      descUz: 'Davolovchi va profilaktik dietalar',
      descRu: 'Лечебные и профилактические диеты',
      image: vetImg,
    },
    {
      key: 'cat_treats',
      slug: 'treats',
      titleUz: 'Mukofotlar', titleRu: 'Лакомства',
      descUz: 'Tarbiya va xush ko\'rish uchun',
      descRu: 'Для дрессировки и угощения',
      image: lifestyleImg,
    },
    {
      key: 'cat_premium',
      slug: 'premium',
      titleUz: 'Premium liniya', titleRu: 'Премиум линия',
      descUz: 'Holistic va super-premium brendlar',
      descRu: 'Холистик и супер-премиум бренды',
      image: ingredientsImg,
    },
    {
      key: 'cat_acc',
      slug: 'aksessuarlar',
      titleUz: 'Aksessuarlar', titleRu: 'Аксессуары',
      descUz: 'Idishlar, o\'yinchoqlar va parvarish',
      descRu: 'Миски, игрушки и уход',
      image: lifestyleImg,
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 lg:py-32 bg-background border-t border-border/60"
      aria-labelledby="shop-categories-title"
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
              contentKey="cats_label"
              fallback={t('XARID QILISH', 'ПОКУПАТЬ')}
              as="span"
              className="text-primary text-xs tracking-[0.3em] uppercase font-medium"
              section="categories"
            />
            <h2
              id="shop-categories-title"
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground mt-4"
            >
              <EditableText
                contentKey="cats_title"
                fallback={t('Sevimlingiz uchun toping', 'Найдите для любимца')}
                as="span"
                section="categories"
              />
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm md:text-right">
            <EditableText
              contentKey="cats_subtitle"
              fallback={t(
                'Hayvon turi va ozuqa formati bo\'yicha tezda tanlang — yosh, salomatlik va ta\'mga qarab.',
                'Выберите по типу питомца и формату корма — с учётом возраста, здоровья и вкуса.'
              )}
              as="span"
              section="categories"
            />
          </p>
        </div>

        {/* HERO SPLIT — Mushuklar / Itlar */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Mushuklar */}
          <Link
            to="/catalog?pet=cat"
            className="group relative overflow-hidden aspect-[4/5] lg:aspect-[5/4] bg-secondary"
            aria-label={t('Mushuklar uchun ozuqa', 'Корм для кошек')}
          >
            <EditableImage
              contentKey="cat_hero_cats"
              fallbackSrc={catImg}
              alt={t('Mushuklar uchun ozuqa', 'Корм для кошек')}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              wrapperClassName="absolute inset-0"
              section="categories"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="relative h-full flex flex-col justify-end p-8 lg:p-12 text-white">
              <span className="text-xs tracking-[0.3em] uppercase opacity-80 mb-3">
                {t('KATEGORIYA 01', 'КАТЕГОРИЯ 01')}
              </span>
              <h3 className="font-serif text-5xl lg:text-6xl leading-none mb-3">
                <EditableText
                  contentKey="cat_hero_cats_title"
                  fallback={t('Mushuklar uchun', 'Для кошек')}
                  as="span"
                  section="categories"
                />
              </h3>
              <p className="max-w-md text-sm lg:text-base text-white/85 mb-6">
                <EditableText
                  contentKey="cat_hero_cats_desc"
                  fallback={t(
                    'Mushukchalar, kattalar, sterilizatsiya qilingan va sezgir mushuklar uchun balanslangan ozuqalar.',
                    'Сбалансированные корма для котят, взрослых, стерилизованных и чувствительных кошек.'
                  )}
                  as="span"
                  section="categories"
                />
              </p>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase group-hover:gap-3 transition-all">
                {t('KO\'RISH', 'СМОТРЕТЬ')} <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Itlar */}
          <Link
            to="/catalog?pet=dog"
            className="group relative overflow-hidden aspect-[4/5] lg:aspect-[5/4] bg-secondary"
            aria-label={t('Itlar uchun ozuqa', 'Корм для собак')}
          >
            <EditableImage
              contentKey="cat_hero_dogs"
              fallbackSrc={puppyImg}
              alt={t('Itlar uchun ozuqa', 'Корм для собак')}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              wrapperClassName="absolute inset-0"
              section="categories"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="relative h-full flex flex-col justify-end p-8 lg:p-12 text-white">
              <span className="text-xs tracking-[0.3em] uppercase opacity-80 mb-3">
                {t('KATEGORIYA 02', 'КАТЕГОРИЯ 02')}
              </span>
              <h3 className="font-serif text-5xl lg:text-6xl leading-none mb-3">
                <EditableText
                  contentKey="cat_hero_dogs_title"
                  fallback={t('Itlar uchun', 'Для собак')}
                  as="span"
                  section="categories"
                />
              </h3>
              <p className="max-w-md text-sm lg:text-base text-white/85 mb-6">
                <EditableText
                  contentKey="cat_hero_dogs_desc"
                  fallback={t(
                    'Kuchukchalar, kattalar, faol va veterinar dietalari — har bir zot va yoshga moslab.',
                    'Щенки, взрослые, активные и ветеринарные диеты — под каждую породу и возраст.'
                  )}
                  as="span"
                  section="categories"
                />
              </p>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase group-hover:gap-3 transition-all">
                {t('KO\'RISH', 'СМОТРЕТЬ')} <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>

        {/* FOOD TYPE GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {foodTypes.map((ft, i) => (
            <Link
              key={ft.key}
              to={`/catalog?category=${ft.slug}`}
              className={`group relative bg-background p-6 lg:p-8 flex flex-col min-h-[220px] lg:min-h-[260px] hover:bg-secondary/40 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-14 h-14 lg:w-16 lg:h-16 overflow-hidden rounded-sm bg-secondary">
                  <img
                    src={ft.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    loading="lazy"
                  />
                </div>
              </div>

              <h3 className="font-serif text-2xl lg:text-3xl text-foreground leading-tight mb-2">
                <EditableText
                  contentKey={`${ft.key}_title`}
                  fallback={t(ft.titleUz, ft.titleRu)}
                  as="span"
                  section="categories"
                />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                <EditableText
                  contentKey={`${ft.key}_desc`}
                  fallback={t(ft.descUz, ft.descRu)}
                  as="span"
                  section="categories"
                />
              </p>

              <span className="mt-auto inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground group-hover:gap-3 group-hover:text-primary transition-all">
                {t('KO\'RISH', 'СМОТРЕТЬ')}
                <ArrowRight className="w-4 h-4" />
              </span>

              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});
