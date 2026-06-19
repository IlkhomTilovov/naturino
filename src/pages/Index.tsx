import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Loader2, Leaf, ShieldCheck, Award, Microscope, HeartPulse, Dog, Cat, Stethoscope, Sparkles, Phone, Send, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { BrandsSection } from '@/components/BrandsSection';
import { useState, useEffect, useRef } from 'react';

import heroImg from '@/assets/naturino-hero.jpg';
import ingredientsImg from '@/assets/naturino-ingredients.jpg';
import vetImg from '@/assets/naturino-vet.jpg';
import puppyImg from '@/assets/naturino-puppy.jpg';
import catImg from '@/assets/naturino-cat.jpg';
import productImg from '@/assets/naturino-product.jpg';
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

const productLines = [
  { key: 'line_sterilised', icon: Cat, titleFallback: 'Sterilised', descFallback: 'Sterilizatsiya qilingan mushuklar uchun balanslangan ozuqa', tagFallback: 'Mushuklar', image: catImg, slug: 'sterilized' },
  { key: 'line_kitten', icon: Cat, titleFallback: 'Kitten', descFallback: 'Mushukchalarning sog\'lom o\'sishi uchun maxsus formula', tagFallback: 'Mushukchalar', image: catImg, slug: 'kitten' },
  { key: 'line_puppy', icon: Dog, titleFallback: 'Puppy', descFallback: 'Kuchukchalar uchun energiya va rivojlanish uchun barcha zarur moddalar', tagFallback: 'Kuchukchalar', image: puppyImg, slug: 'puppy' },
  { key: 'line_sensitive', icon: HeartPulse, titleFallback: 'Sensitive', descFallback: 'Sezgir oshqozon va terini parvarish qiluvchi gipoallergen liniya', tagFallback: 'Sezgir', image: lifestyleImg, slug: 'sensitive' },
  { key: 'line_veterinary', icon: Stethoscope, titleFallback: 'Veterinary', descFallback: 'Veterinar nazoratidagi davolovchi va profilaktik dietalar', tagFallback: 'Veterinariya', image: vetImg, slug: 'veterinar-ozuqa' },
];

const ingredients = [
  { key: 'ing_1', titleFallback: 'Yangi go\'sht', descFallback: 'Tovuq va qo\'zichoq go\'shti — protein manbai #1' },
  { key: 'ing_2', titleFallback: 'Atlantika qizil baliq', descFallback: 'Omega-3 va omega-6 yog\'lari teri va junni mustahkamlaydi' },
  { key: 'ing_3', titleFallback: 'Jigarrang guruch', descFallback: 'Engil hazm bo\'ladigan murakkab uglevodlar' },
  { key: 'ing_4', titleFallback: 'Shirin kartoshka', descFallback: 'Tabiiy klechatka va vitaminlar manbai' },
  { key: 'ing_5', titleFallback: 'Yovvoyi mevalar', descFallback: 'Antioksidantlar bilan immunitetni mustahkamlash' },
  { key: 'ing_6', titleFallback: 'Bibariya va o\'tlar', descFallback: 'Tabiiy konservant — sun\'iy qo\'shimchalarsiz' },
];

const articles = [
  { key: 'art_1', tagFallback: 'Oziqlanish', titleFallback: 'Itingiz uchun to\'g\'ri ozuqani qanday tanlash kerak', descFallback: 'Yosh, zot va aktivlikka qarab kunlik ratsionni hisoblash bo\'yicha qo\'llanma.', image: puppyImg },
  { key: 'art_2', tagFallback: 'Salomatlik', titleFallback: 'Mushukda urinariy sindrom: oldini olish va dieta', descFallback: 'Veterinardan amaliy maslahatlar va profilaktik ozuqalar tanlovi.', image: catImg },
  { key: 'art_3', tagFallback: 'Parvarish', titleFallback: 'Sterilizatsiyadan keyin: yangi oziqlanish rejimi', descFallback: 'Ortiqcha vaznning oldini olish va metabolizmni qo\'llab-quvvatlash bo\'yicha qadam-baqadam.', image: lifestyleImg },
];

const faqs = [
  { key: 'faq_1', q: 'Naturino mahsulotlari original ekanligini qanday bilsam bo\'ladi?', a: 'Biz faqat rasmiy distribyutorlar bilan ishlaymiz. Har bir qadoqda partiya raqami va ishlab chiqarish sanasi ko\'rsatilgan, talab qilsangiz sertifikat yuboramiz.' },
  { key: 'faq_2', q: 'Yetkazib berish qancha vaqt oladi?', a: 'Toshkent bo\'ylab 1–2 ish kuni, viloyatlarga 2–4 ish kuni ichida yetkazib beramiz. 300 000 so\'mdan yuqori buyurtmalarga shahar ichida bepul.' },
  { key: 'faq_3', q: 'Hayvonim uchun mos ozuqani qanday tanlayman?', a: 'Saytimizdagi tavsiya markazidan foydalaning yoki menejerimiz bilan bog\'laning — yoshi, vazni va salomatlik holatiga qarab tanlab beramiz.' },
  { key: 'faq_4', q: 'Ozuqa hayvonimga to\'g\'ri kelmasa, qaytarib bo\'ladimi?', a: 'Ha. Ochilmagan qadoqlarni 14 kun ichida qaytarib berishingiz mumkin. Ochilgan qadoq bo\'lsa ham, sabab asosli bo\'lsa almashtirish imkoniyati bor.' },
  { key: 'faq_5', q: 'Avtomatik oylik yetkazib berish bormi?', a: 'Ha. "Obuna" xizmati orqali har oy belgilangan kuni eshigingizgacha yetkazib beramiz va 7% chegirma beramiz.' },
];

export default function Index() {
  const { language } = useLanguage();
  useSEO({});
  const { products: featuredProducts, loading: productsLoading } = useFeaturedProducts(6);
  const { settings } = useSystemSettings();
  const contactPhone = settings?.contact_phone || '+998 90 123 45 67';

  const sAbout = useInView();
  const sLines = useInView();
  const sWhy = useInView();
  const sIng = useInView();
  const sQuality = useInView();
  const sRec = useInView();
  const sProd = useInView();
  const sArt = useInView();
  const sNews = useInView();
  const sFaq = useInView();
  const sCta = useInView();

  return (
    <div className="min-h-screen bg-background">

      {/* ============ HERO — full-bleed image with overlay text ============ */}
      <section className="relative w-full min-h-[88vh] lg:min-h-[92vh] flex flex-col overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <EditableImage
            contentKey="hero_image"
            fallbackSrc={heroImg}
            alt="Naturino premium pet food"
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
            section="hero"
          />
          {/* Legibility overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 pointer-events-none" />
        </div>

        {/* Top meta strip */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-8 lg:pt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 lg:pb-8 border-b border-foreground/15 [&_a]:pointer-events-auto [&_[data-editable]]:pointer-events-auto">
            <EditableText
              contentKey="hero_eyebrow"
              fallback="EST. 2020 — TOSHKENT"
              as="span"
              className="text-xs tracking-[0.3em] uppercase text-foreground/70"
              section="hero"
            />
            <EditableText
              contentKey="hero_meta"
              fallback="Premium pet nutrition · Rasmiy distribyutor"
              as="span"
              className="text-xs tracking-wider uppercase text-foreground/70 hidden md:inline"
              section="hero"
            />
          </div>
        </div>

        {/* Main content overlaid */}
        <div className="relative z-10 flex-1 container mx-auto px-4 lg:px-8 py-12 lg:py-20 flex items-center pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 w-full [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_[data-editable]]:pointer-events-auto">
            {/* Headline */}
            <div className="lg:col-span-7">
              <h1 className="font-serif text-[2.75rem] sm:text-6xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-foreground drop-shadow-sm">
                <EditableText contentKey="hero_title_1" fallback="Sevgi bilan" as="span" className="block" section="hero" />
                <EditableText contentKey="hero_title_2" fallback="tayyorlangan ovqat." as="span" className="block italic text-primary" section="hero" />
                <EditableText contentKey="hero_title_3" fallback="Sog'liq bilan o'sgan do'st." as="span" className="block" section="hero" />
              </h1>

              <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="rounded-full px-8 h-14 text-sm tracking-wider uppercase shadow-lg">
                  <Link to="/catalog">
                    <EditableText contentKey="hero_cta_1" fallback="Mahsulotlarni ko'rish" as="span" section="hero" />
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-sm tracking-wider uppercase bg-background/60 backdrop-blur-sm border-foreground/20">
                  <Link to="/about">
                    <EditableText contentKey="hero_cta_2" fallback="Naturino haqida" as="span" section="hero" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Side description + stats */}
            <div className="lg:col-span-5 lg:pt-6">
              <div className="bg-background/60 backdrop-blur-sm rounded-sm p-6 lg:p-8 max-w-md border border-foreground/10">
                <p className="text-base lg:text-lg text-foreground/80 leading-relaxed">
                  <EditableText
                    contentKey="hero_sub"
                    fallback="Naturino — itlar va mushuklar uchun mutaxassislar tomonidan ishlab chiqilgan premium ozuqa brendi. Tabiiy ingredientlar, veterinariya nazorati va sevimli do'stingizning har bir hayot bosqichi uchun aniq formulalar."
                    as="span"
                    section="hero"
                  />
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-foreground/10">
                  <div>
                    <div className="font-serif text-3xl text-foreground">35+</div>
                    <EditableText contentKey="hero_stat_1" fallback="Ingredient turi" as="p" className="text-xs text-muted-foreground mt-1" section="hero" />
                  </div>
                  <div>
                    <div className="font-serif text-3xl text-foreground">12</div>
                    <EditableText contentKey="hero_stat_2" fallback="Maxsus liniya" as="p" className="text-xs text-muted-foreground mt-1" section="hero" />
                  </div>
                  <div>
                    <div className="font-serif text-3xl text-foreground">5K+</div>
                    <EditableText contentKey="hero_stat_3" fallback="Baxtli mijoz" as="p" className="text-xs text-muted-foreground mt-1" section="hero" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <BrandsSection />

      {/* ============ ABOUT — alternating ============ */}
      <section ref={sAbout.ref} className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            <div className={`lg:col-span-6 order-2 lg:order-1 transition-all duration-700 ${sAbout.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <EditableImage contentKey="about_image" fallbackSrc={productImg} alt="Naturino brand" className="w-full h-full object-cover" wrapperClassName="w-full h-full" section="about" />
              </div>
            </div>
            <div className={`lg:col-span-6 order-1 lg:order-2 transition-all duration-700 delay-150 ${sAbout.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <EditableText contentKey="about_eyebrow" fallback="BRENDIMIZ" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="about" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="about_title" fallback="Tabiatdan ilhomlangan, fan tomonidan tasdiqlangan." as="span" section="about" />
              </h2>
              <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
                <EditableText
                  contentKey="about_p1"
                  fallback="Naturino — Yevropalik nutrisionistlar, veterinarlar va texnologlar tomonidan ishlab chiqarilgan premium pet-food brendi. Har bir formula uy hayvonlarining tabiiy ehtiyojlarini chuqur o'rganish asosida yaratilgan."
                  as="p"
                  section="about"
                />
                <EditableText
                  contentKey="about_p2"
                  fallback="Biz sun'iy bo'yoq, kuchaytirgich va konservantlardan voz kechdik. Faqat insonlar iste'mol qiladigan sifatdagi xom-ashyo — yangi go'sht, baliq, sabzavot va shifobaxsh o'tlar."
                  as="p"
                  section="about"
                />
              </div>
              <div className="mt-10">
                <Link to="/about" className="inline-flex items-center gap-2 text-sm tracking-wider uppercase font-medium text-foreground border-b border-foreground pb-1 hover:gap-3 transition-all">
                  <EditableText contentKey="about_cta" fallback="Brend hikoyamiz" as="span" section="about" />
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT LINES — editorial cards ============ */}
      <section ref={sLines.ref} className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`max-w-3xl mb-14 lg:mb-20 transition-all duration-700 ${sLines.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <EditableText contentKey="lines_eyebrow" fallback="MAHSULOT LINIYALARI" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="lines" />
            <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
              <EditableText contentKey="lines_title" fallback="Har bir hayot bosqichi uchun aniq formula." as="span" section="lines" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {productLines.map((line, i) => {
              const Icon = line.icon;
              return (
                <Link
                  key={line.key}
                  to={`/catalog?category=${line.slug}`}
                  className={`group relative bg-background p-8 lg:p-10 flex flex-col min-h-[420px] hover:bg-secondary/40 transition-colors duration-500 ${sLines.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <EditableText contentKey={`${line.key}_tag`} fallback={line.tagFallback} as="span" className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground" section="lines" />
                  </div>
                  <div className="aspect-square w-24 mb-8 overflow-hidden rounded-sm">
                    <img src={line.image} alt={line.titleFallback} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <h3 className="font-serif text-3xl lg:text-4xl text-foreground mb-3">
                    <EditableText contentKey={`${line.key}_title`} fallback={line.titleFallback} as="span" section="lines" />
                  </h3>
                  <EditableText contentKey={`${line.key}_desc`} fallback={line.descFallback} as="p" className="text-sm text-muted-foreground leading-relaxed mb-6" section="lines" />
                  <span className="mt-auto inline-flex items-center gap-2 text-xs tracking-wider uppercase text-foreground/80 group-hover:gap-3 transition-all">
                    Liniyani ko'rish <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
            {/* Filler card for symmetry */}
            <div className="hidden lg:flex bg-primary/5 p-10 flex-col justify-between min-h-[420px]">
              <div>
                <EditableText contentKey="lines_extra_eyebrow" fallback="MASLAHAT" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="lines" />
                <h3 className="mt-4 font-serif text-3xl text-foreground leading-tight">
                  <EditableText contentKey="lines_extra_title" fallback="Mos liniyani bilmayapsizmi?" as="span" section="lines" />
                </h3>
              </div>
              <Button asChild variant="outline" className="rounded-full self-start mt-6">
                <Link to="#recommendation">Tavsiya oling <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY NATURINO — manifesto ============ */}
      <section ref={sWhy.ref} className="py-20 lg:py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`max-w-4xl transition-all duration-700 ${sWhy.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <EditableText contentKey="why_eyebrow" fallback="NEGA NATURINO" as="span" className="text-xs tracking-[0.3em] uppercase text-background/60" section="why" />
            <h2 className="mt-4 font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05]">
              <EditableText contentKey="why_title" fallback={"Biz \"oziq-ovqat\" sotmaymiz. Biz uzoq, sog'lom va baxtli umrni qadoqlaymiz."} as="span" section="why" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mt-16 lg:mt-24">
            {[
              { k: 'why_1', icon: Leaf, t: 'Tabiiy formula', d: 'Sun\'iy bo\'yoq, konservant va kuchaytirgichlarsiz' },
              { k: 'why_2', icon: Microscope, t: 'Veterinariya R&D', d: 'Har bir resept nutrisionist va veterinar tomonidan tasdiqlangan' },
              { k: 'why_3', icon: ShieldCheck, t: 'Sifat nazorati', d: '14 bosqichli laboratoriya tekshiruvi va xalqaro sertifikatlar' },
              { k: 'why_4', icon: Award, t: 'Hayot bosqichi', d: 'Mushukcha, voyaga yetgan, sterilizatsiyalangan, qariyalar uchun alohida' },
            ].map((w, i) => {
              const Icon = w.icon;
              return (
                <div key={w.k} className={`transition-all duration-700 ${sWhy.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <Icon className="w-7 h-7 mb-6 text-primary" />
                  <h3 className="font-serif text-2xl mb-3">
                    <EditableText contentKey={`${w.k}_t`} fallback={w.t} as="span" section="why" />
                  </h3>
                  <EditableText contentKey={`${w.k}_d`} fallback={w.d} as="p" className="text-sm text-background/70 leading-relaxed" section="why" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ INGREDIENTS ============ */}
      <section ref={sIng.ref} className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className={`lg:col-span-5 lg:sticky lg:top-24 self-start transition-all duration-700 ${sIng.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <EditableText contentKey="ing_eyebrow" fallback="INGREDIENTLAR" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="ingredients" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="ing_title" fallback="Qadoqdagi har bir donachani biz tanlaymiz." as="span" section="ingredients" />
              </h2>
              <EditableText contentKey="ing_desc" fallback="Ingredientlar Italiya, Norvegiya va O'zbekiston fermerlaridan keladi. Hech qanday yashirin formula yo'q — har bir komponent qadoqda ochiq yozilgan." as="p" className="mt-6 text-muted-foreground leading-relaxed" section="ingredients" />
              <div className="mt-10 aspect-[4/3] overflow-hidden rounded-sm">
                <EditableImage contentKey="ing_image" fallbackSrc={ingredientsImg} alt="Naturino ingredients" className="w-full h-full object-cover" wrapperClassName="w-full h-full" section="ingredients" />
              </div>
            </div>
            <div className={`lg:col-span-7 transition-all duration-700 delay-150 ${sIng.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <ul className="divide-y divide-border">
                {ingredients.map((ing, i) => (
                  <li key={ing.key} className="py-8 lg:py-10 grid grid-cols-12 gap-6 items-baseline group">
                    <span className="col-span-2 font-serif text-xl text-muted-foreground">0{i + 1}</span>
                    <div className="col-span-10">
                      <h3 className="font-serif text-2xl lg:text-3xl text-foreground mb-2 group-hover:text-primary transition-colors">
                        <EditableText contentKey={`${ing.key}_t`} fallback={ing.titleFallback} as="span" section="ingredients" />
                      </h3>
                      <EditableText contentKey={`${ing.key}_d`} fallback={ing.descFallback} as="p" className="text-sm text-muted-foreground" section="ingredients" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUALITY / CERTIFICATION ============ */}
      <section ref={sQuality.ref} className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            <div className={`lg:col-span-6 transition-all duration-700 ${sQuality.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <EditableImage contentKey="quality_image" fallbackSrc={vetImg} alt="Quality control" className="w-full h-full object-cover" wrapperClassName="w-full h-full" section="quality" />
              </div>
            </div>
            <div className={`lg:col-span-6 transition-all duration-700 delay-150 ${sQuality.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <EditableText contentKey="quality_eyebrow" fallback="SIFAT VA SERTIFIKATLAR" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="quality" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="quality_title" fallback="Ishonchni har bir bosqichda quramiz." as="span" section="quality" />
              </h2>
              <EditableText contentKey="quality_desc" fallback="Naturino ishlab chiqarishi xalqaro standartlar bo'yicha sertifikatlangan zavodlarda amalga oshiriladi. Har bir partiya yetkazib berishdan oldin mustaqil laboratoriyada tekshiriladi." as="p" className="mt-6 text-muted-foreground leading-relaxed" section="quality" />

              <div className="mt-10 grid grid-cols-2 gap-px bg-border border border-border">
                {[
                  { k: 'cert_1', t: 'ISO 22000', d: 'Oziq-ovqat xavfsizligi' },
                  { k: 'cert_2', t: 'HACCP', d: 'Xavfli omillar nazorati' },
                  { k: 'cert_3', t: 'FEDIAF', d: 'Yevropa pet-food standarti' },
                  { k: 'cert_4', t: 'GMP+', d: 'Sifatli ishlab chiqarish' },
                ].map(c => (
                  <div key={c.k} className="bg-background p-6">
                    <div className="font-serif text-2xl text-foreground">
                      <EditableText contentKey={`${c.k}_t`} fallback={c.t} as="span" section="quality" />
                    </div>
                    <EditableText contentKey={`${c.k}_d`} fallback={c.d} as="p" className="text-xs text-muted-foreground mt-1" section="quality" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RECOMMENDATION CENTER ============ */}
      <section ref={sRec.ref} id="recommendation" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-sm overflow-hidden bg-primary/10 p-8 md:p-14 lg:p-20">
            <div className={`max-w-3xl transition-all duration-700 ${sRec.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <EditableText contentKey="rec_eyebrow" fallback="TAVSIYA MARKAZI" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="recommendation" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="rec_title" fallback="Hayvoningiz uchun mukammal ozuqani 60 soniyada toping." as="span" section="recommendation" />
              </h2>
              <EditableText contentKey="rec_desc" fallback="3 ta savolga javob bering — biz yoshi, zoti, vazni va salomatlik holatiga qarab ozuqa tanlab beramiz. Bepul va majburiyatlarsiz." as="p" className="mt-6 text-muted-foreground leading-relaxed max-w-xl" section="recommendation" />

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                <Link to="/catalog?pet=dog" className="group flex items-center gap-4 bg-background border border-border rounded-sm p-5 hover:border-primary transition-colors">
                  <Dog className="w-6 h-6 text-primary" />
                  <div>
                    <EditableText contentKey="rec_opt_1" fallback="Itim bor" as="span" className="font-serif text-lg block text-foreground" section="recommendation" />
                    <span className="text-xs text-muted-foreground">Tanlash →</span>
                  </div>
                </Link>
                <Link to="/catalog?pet=cat" className="group flex items-center gap-4 bg-background border border-border rounded-sm p-5 hover:border-primary transition-colors">
                  <Cat className="w-6 h-6 text-primary" />
                  <div>
                    <EditableText contentKey="rec_opt_2" fallback="Mushugim bor" as="span" className="font-serif text-lg block text-foreground" section="recommendation" />
                    <span className="text-xs text-muted-foreground">Tanlash →</span>
                  </div>
                </Link>
                <Link to="/contact" className="group flex items-center gap-4 bg-background border border-border rounded-sm p-5 hover:border-primary transition-colors">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  <div>
                    <EditableText contentKey="rec_opt_3" fallback="Veterinar bilan" as="span" className="font-serif text-lg block text-foreground" section="recommendation" />
                    <span className="text-xs text-muted-foreground">Bog'lanish →</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section ref={sProd.ref} className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 lg:mb-20 transition-all duration-700 ${sProd.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-2xl">
              <EditableText contentKey="prod_eyebrow" fallback="KATALOG" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="products" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="prod_title" fallback="Tanlangan mahsulotlar" as="span" section="products" />
              </h2>
            </div>
            <Button asChild variant="ghost" className="rounded-full self-start md:self-end">
              <Link to="/catalog">Barchasini ko'rish <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-20">Mahsulotlar tez orada qo'shiladi</p>
          )}
        </div>
      </section>

      {/* ============ ARTICLES / BLOG ============ */}
      <section ref={sArt.ref} className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 lg:mb-20 transition-all duration-700 ${sArt.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-2xl">
              <EditableText contentKey="art_eyebrow" fallback="JURNAL" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="articles" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="art_title" fallback="Bilim — eng yaxshi parvarish." as="span" section="articles" />
              </h2>
            </div>
            <EditableText contentKey="art_desc" fallback="Veterinarlar va mutaxassislardan amaliy maslahatlar, oziqlanish bo'yicha qo'llanmalar va salomatlik haqida maqolalar." as="p" className="text-muted-foreground max-w-md" section="articles" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {articles.map((a, i) => (
              <article key={a.key} className={`group transition-all duration-700 ${sArt.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6">
                  <img src={a.image} alt={a.titleFallback} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute top-4 left-4 bg-background px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
                    <EditableText contentKey={`${a.key}_tag`} fallback={a.tagFallback} as="span" section="articles" />
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                  <EditableText contentKey={`${a.key}_t`} fallback={a.titleFallback} as="span" section="articles" />
                </h3>
                <EditableText contentKey={`${a.key}_d`} fallback={a.descFallback} as="p" className="text-sm text-muted-foreground leading-relaxed" section="articles" />
                <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-wider uppercase text-foreground">
                  O'qish <ArrowUpRight className="w-3 h-3" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWS / PROMOTIONS ============ */}
      <section ref={sNews.ref} className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className={`relative overflow-hidden rounded-sm aspect-[4/3] lg:aspect-auto lg:min-h-[480px] bg-foreground text-background p-8 lg:p-14 flex flex-col justify-between transition-all duration-700 ${sNews.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <img src={puppyImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
              <div className="relative">
                <EditableText contentKey="news_1_tag" fallback="AKSIYA" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="news" />
                <h3 className="mt-4 font-serif text-4xl lg:text-5xl leading-tight">
                  <EditableText contentKey="news_1_t" fallback="Yangi mijozlarga birinchi buyurtmaga -15%" as="span" section="news" />
                </h3>
              </div>
              <Button asChild variant="outline" className="relative self-start rounded-full border-background/40 text-background hover:bg-background hover:text-foreground bg-transparent">
                <Link to="/catalog">Aksiyani olish <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
            <div className={`relative overflow-hidden rounded-sm aspect-[4/3] lg:aspect-auto lg:min-h-[480px] bg-primary/15 p-8 lg:p-14 flex flex-col justify-between transition-all duration-700 delay-150 ${sNews.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div>
                <EditableText contentKey="news_2_tag" fallback="OBUNA" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="news" />
                <h3 className="mt-4 font-serif text-4xl lg:text-5xl leading-tight text-foreground">
                  <EditableText contentKey="news_2_t" fallback="Oylik avtomatik yetkazib berish — har safar 7% chegirma" as="span" section="news" />
                </h3>
              </div>
              <Button asChild className="self-start rounded-full">
                <Link to="/catalog">Obuna bo'lish <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section ref={sFaq.ref} className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className={`lg:col-span-5 lg:sticky lg:top-24 self-start transition-all duration-700 ${sFaq.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <EditableText contentKey="faq_eyebrow" fallback="SAVOL-JAVOB" as="span" className="text-xs tracking-[0.3em] uppercase text-primary" section="faq" />
              <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-foreground">
                <EditableText contentKey="faq_title" fallback="Tez-tez beriladigan savollar." as="span" section="faq" />
              </h2>
              <EditableText contentKey="faq_desc" fallback="Javob topa olmadingizmi? Menejerimiz Telegram orqali 5 daqiqada javob beradi." as="p" className="mt-6 text-muted-foreground" section="faq" />
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link to="/contact">Savol berish <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
            <div className={`lg:col-span-7 transition-all duration-700 delay-150 ${sFaq.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map(f => (
                  <AccordionItem key={f.key} value={f.key} className="border-b border-border">
                    <AccordionTrigger className="py-6 text-left font-serif text-lg lg:text-xl text-foreground hover:no-underline hover:text-primary [&[data-state=open]]:text-primary">
                      <EditableText contentKey={`${f.key}_q`} fallback={f.q} as="span" section="faq" />
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                      <EditableText contentKey={`${f.key}_a`} fallback={f.a} as="span" section="faq" />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section ref={sCta.ref} className="py-20 lg:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className={`max-w-4xl transition-all duration-700 ${sCta.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Sparkles className="w-8 h-8 text-primary mb-6" />
            <h2 className="font-serif text-5xl md:text-6xl lg:text-8xl leading-[0.95]">
              <EditableText contentKey="cta_title_1" fallback="Hayvoningizga" as="span" className="block" section="cta" />
              <EditableText contentKey="cta_title_2" fallback="munosib ovqatni bering." as="span" className="block italic text-primary" section="cta" />
            </h2>
            <EditableText contentKey="cta_desc" fallback="Birinchi buyurtmangizga -15% chegirma va bepul veterinar maslahati." as="p" className="mt-8 text-lg text-background/70 max-w-xl" section="cta" />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full h-14 px-8 text-sm tracking-wider uppercase">
                <Link to="/catalog">Hozir buyurtma berish <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground text-sm tracking-wider uppercase">
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`}>
                  <Phone className="w-4 h-4 mr-2" />{contactPhone}
                </a>
              </Button>
              {settings?.social_telegram && (
                <Button asChild variant="ghost" size="lg" className="rounded-full h-14 px-6 text-background hover:bg-background/10 text-sm tracking-wider uppercase">
                  <a href={settings.social_telegram} target="_blank" rel="noopener noreferrer">
                    <Send className="w-4 h-4 mr-2" /> Telegram
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
