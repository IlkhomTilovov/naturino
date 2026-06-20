import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Download, ShieldCheck, Factory, Award, Layers,
  Microscope, FileCheck2, PackageCheck, Truck, FlaskConical, Leaf, Beef, Fish,
  Wheat, Drumstick, CheckCircle2, XCircle, MessageSquare, Phone, Mail, Send,
  MapPin, Globe2, Boxes, ClipboardList, Sparkles, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSEO } from '@/hooks/useSEO';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { useEffect, useRef, useState } from 'react';

import heroImg from '@/assets/naturino-hero.jpg';
import factoryImg from '@/assets/naturino-vet.jpg';
import ingredientsImg from '@/assets/naturino-ingredients.jpg';
import dryDogImg from '@/assets/naturino-puppy.jpg';
import wetDogImg from '@/assets/naturino-product.jpg';
import dryCatImg from '@/assets/naturino-cat.jpg';
import wetCatImg from '@/assets/naturino-lifestyle.jpg';
import treatsImg from '@/assets/naturino-product.jpg';

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

const whyCards = [
  { icon: ShieldCheck, title: 'Consistent Quality', desc: 'Every batch laboratory-tested with strict in-house QC and AAFCO-aligned formulation.' },
  { icon: BadgeCheck, title: 'Certified Export', desc: 'HACCP, ISO 22000, GMP, veterinary and customs documentation included with every shipment.' },
  { icon: Factory, title: 'Reliable Production', desc: '12 000+ tons annual capacity, predictable lead times and stable supply for long contracts.' },
  { icon: Layers, title: 'Private Label Flexibility', desc: 'Your brand, your recipe, your packaging — full OEM/private-label development under one roof.' },
];

const categories = [
  { image: dryDogImg, tag: 'Dogs · Dry', title: 'Dry Dog Food', protein: '22–32%', packs: '1 / 3 / 10 / 20 kg', shelf: '18 months', moq: '5 tons' },
  { image: wetDogImg, tag: 'Dogs · Wet', title: 'Wet Dog Food', protein: '8–12%', packs: '100 / 200 / 400 g', shelf: '24 months', moq: '3 tons' },
  { image: dryCatImg, tag: 'Cats · Dry', title: 'Dry Cat Food', protein: '28–36%', packs: '0.4 / 1.5 / 5 / 10 kg', shelf: '18 months', moq: '5 tons' },
  { image: wetCatImg, tag: 'Cats · Wet', title: 'Wet Cat Food', protein: '9–13%', packs: '85 / 100 / 200 g', shelf: '24 months', moq: '3 tons' },
  { image: treatsImg, tag: 'Snacks', title: 'Treats & Snacks', protein: '18–28%', packs: '50 / 100 / 250 g', shelf: '12 months', moq: '2 tons' },
];

const privateLabelSteps = [
  { n: '01', title: 'Recipe Selection', desc: 'Choose from 40+ tested formulas or co-develop a custom recipe with our nutritionists.' },
  { n: '02', title: 'Packaging Design', desc: 'Bag, pouch or can — your brand artwork printed on export-ready packaging.' },
  { n: '03', title: 'Manufacturing', desc: 'Production under HACCP & ISO 22000 with batch traceability and laboratory release.' },
  { n: '04', title: 'Export & Delivery', desc: 'Full export paperwork, container loading and delivery to your destination port.' },
];

const manufacturingPoints = [
  'Veterinary nutritionist supervision on every formula',
  'In-house laboratory testing for each production batch',
  'HACCP & ISO 22000 compliant production lines',
  'Complete export documentation and customs support',
  'End-to-end batch traceability and quality control',
];

const ingredientList = [
  { icon: Drumstick, name: 'Chicken', desc: 'Premium poultry protein — highly digestible and palatable.' },
  { icon: Beef, name: 'Lamb', desc: 'Hypoallergenic red meat rich in essential amino acids.' },
  { icon: Beef, name: 'Beef', desc: 'High-quality beef protein for muscle development and energy.' },
  { icon: Fish, name: 'Salmon', desc: 'Omega-3 rich salmon for skin, coat and immune health.' },
  { icon: Wheat, name: 'Rice & Grains', desc: 'Easily digestible carbohydrate sources for steady energy.' },
];

const supplierCompare = {
  traditional: [
    'Multiple intermediaries between you and the factory',
    'Higher final cost due to layered margins',
    'Slow communication, weeks for clarification',
    'Limited or no recipe / packaging customization',
    'Fragmented documentation, customs risk',
  ],
  naturino: [
    'Factory-direct pricing, no intermediaries',
    'Dedicated export team and project manager',
    'Response within 24 hours, transparent timelines',
    'Full private-label and recipe customization',
    'Complete export & veterinary documentation',
  ],
};

const processSteps = [
  { n: 1, icon: Send, title: 'Send Inquiry', desc: 'Share your target market, volume and product brief.' },
  { n: 2, icon: PackageCheck, title: 'Receive Samples', desc: 'We ship production samples for your evaluation.' },
  { n: 3, icon: ClipboardList, title: 'Approve Formulation', desc: 'Lock the recipe, packaging and specifications.' },
  { n: 4, icon: Factory, title: 'Production', desc: 'Manufacturing under HACCP & ISO standards.' },
  { n: 5, icon: Microscope, title: 'Quality Control', desc: 'Laboratory release and batch certification.' },
  { n: 6, icon: Truck, title: 'Export Shipment', desc: 'Container loading, documents and delivery.' },
];

const certifications = [
  { code: 'HACCP', title: 'HACCP', desc: 'Hazard analysis & critical control points.' },
  { code: 'ISO', title: 'ISO 22000', desc: 'International food safety management.' },
  { code: 'GMP', title: 'GMP', desc: 'Good manufacturing practice standards.' },
  { code: 'VET', title: 'Veterinary', desc: 'State veterinary approval & registration.' },
  { code: 'EXP', title: 'Export', desc: 'Customs and phytosanitary certificates.' },
];

const articles = [
  { tag: 'Export', title: 'How to choose pet food for export markets', desc: 'Key formulation, packaging and certification considerations for global distribution.', image: ingredientsImg },
  { tag: 'Private Label', title: 'Private label opportunities in Central Asia', desc: 'Why brands are sourcing OEM production from Uzbekistan and what to expect.', image: factoryImg },
  { tag: 'Quality', title: 'Pet food quality standards explained', desc: 'A practical guide to HACCP, ISO 22000, AAFCO and FEDIAF requirements.', image: dryDogImg },
];

const faqs = [
  { q: 'What is the MOQ?', a: 'Standard MOQ starts from 3 tons for wet food and 5 tons for dry food per SKU. Private-label MOQs are agreed per project.' },
  { q: 'Which countries do you export to?', a: 'We currently export to 20+ countries across the CIS, Middle East, EU and South-East Asia. Full destination support is included.' },
  { q: 'Do you offer private label production?', a: 'Yes. Full OEM/private-label service — recipe development, packaging design, manufacturing and export under your brand.' },
  { q: 'What certifications do you have?', a: 'HACCP, ISO 22000, GMP, state veterinary approvals and full export documentation including phytosanitary and customs certificates.' },
  { q: 'Can you customize recipes?', a: 'Yes. Our in-house veterinary nutritionists develop and adapt formulas based on your target market, animal type, life stage and price segment.' },
];

const trustIndicators = [
  { value: '12+', label: 'Years Experience' },
  { value: '20+', label: 'Export Countries' },
  { value: '12 000+', label: 'Tons Annual Capacity' },
  { value: '40+', label: 'SKU Products' },
];

export default function Index() {
  useSEO({});
  const { settings } = useSystemSettings();
  const contactPhone = settings?.contact_phone || '+998 90 123 45 67';
  const contactEmail = settings?.contact_email || 'export@naturino.uz';

  const s = {
    why: useInView(), cats: useInView(), pl: useInView(), mfg: useInView(),
    ing: useInView(), cmp: useInView(), proc: useInView(), cert: useInView(),
    blog: useInView(), faq: useInView(), cta: useInView(),
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ============ 1. HERO ============ */}
      <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EditableImage
            contentKey="hero_image"
            fallbackSrc={heroImg}
            alt="Naturino pet food manufacturing facility"
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
            section="hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-accent animate-pulse" />
              <EditableText contentKey="hero_eyebrow" fallback="EXPORT-READY MANUFACTURER · UZBEKISTAN" as="span" className="text-xs tracking-[0.25em] uppercase text-white/90" section="hero" />
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
              <EditableText contentKey="hero_title" fallback="Premium Pet Food Manufacturing for Global Markets" as="span" section="hero" />
            </h1>

            <p className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed mb-10">
              <EditableText
                contentKey="hero_sub"
                fallback="Export-ready dry and wet pet food, private label production and reliable manufacturing from Uzbekistan."
                as="span"
                section="hero"
              />
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Button asChild size="lg" className="rounded-2xl h-14 px-8 text-sm tracking-wider uppercase bg-gold-accent text-foreground hover:bg-gold-accent/90 shadow-xl">
                <Link to="/contact">
                  <EditableText contentKey="hero_cta_1" fallback="Request Quote" as="span" section="hero" />
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl h-14 px-8 text-sm tracking-wider uppercase bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
                <Link to="/catalog">
                  <Download className="w-4 h-4 mr-2" />
                  <EditableText contentKey="hero_cta_2" fallback="Download Catalog" as="span" section="hero" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 pt-10 border-t border-white/20">
              {trustIndicators.map((t) => (
                <div key={t.label}>
                  <div className="font-heading text-3xl lg:text-4xl text-gold-accent">{t.value}</div>
                  <div className="text-xs lg:text-sm text-white/70 mt-2 tracking-wide">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. WHY NATURINO ============ */}
      <section ref={s.why.ref} className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">WHY NATURINO</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              More Than a Supplier — A Long-Term Manufacturing Partner
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className={`group p-8 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-500 ${s.why.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-3">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 3. PRODUCT CATEGORIES ============ */}
      <section ref={s.cats.ref} className="py-24 lg:py-32 bg-warm-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">PRODUCT LINES</span>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
                Export-Ready Product Lines
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-2xl h-12 px-6 self-start">
              <Link to="/catalog">View Full Catalog <ArrowUpRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <div
                key={c.title}
                className={`group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-500 ${s.cats.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/95 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                    {c.tag}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="font-heading text-2xl text-foreground mb-5">{c.title}</h3>
                  <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Protein</dt><dd className="text-foreground font-medium mt-0.5">{c.protein}</dd></div>
                    <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Shelf life</dt><dd className="text-foreground font-medium mt-0.5">{c.shelf}</dd></div>
                    <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Packaging</dt><dd className="text-foreground font-medium mt-0.5">{c.packs}</dd></div>
                    <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">MOQ</dt><dd className="text-foreground font-medium mt-0.5">{c.moq}</dd></div>
                  </dl>
                  <Link to="/catalog" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Request specifications <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. PRIVATE LABEL ============ */}
      <section ref={s.pl.ref} className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-gold-accent font-medium">PRIVATE LABEL · OEM</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              Your Brand, Our Manufacturing
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed">
              From concept to container — we build private-label pet food for distributors, retailers and emerging brands worldwide.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {privateLabelSteps.map((step, i) => (
              <div
                key={step.n}
                className={`relative rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/15 p-8 hover:bg-primary-foreground/10 transition-all duration-500 ${s.pl.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-heading text-5xl text-gold-accent mb-6">{step.n}</div>
                <h3 className="font-heading text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-primary-foreground/75 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <Button asChild size="lg" className="rounded-2xl h-14 px-8 bg-gold-accent text-foreground hover:bg-gold-accent/90 text-sm tracking-wider uppercase">
            <Link to="/contact">Start Private Label Project <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* ============ 5. MANUFACTURING EXCELLENCE ============ */}
      <section ref={s.mfg.ref} className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className={`lg:col-span-7 transition-all duration-700 ${s.mfg.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-warm-lg">
                <img src={factoryImg} alt="Naturino manufacturing facility" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 p-5 rounded-2xl bg-background/95 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs tracking-wider uppercase text-muted-foreground">Production capacity</div>
                    <div className="font-heading text-lg text-foreground">12 000+ tons / year</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-5 transition-all duration-700 delay-150 ${s.mfg.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">MANUFACTURING</span>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl leading-[1.1] text-foreground">
                Manufactured Under International Standards
              </h2>
              <ul className="mt-10 space-y-5">
                {manufacturingPoints.map((p) => (
                  <li key={p} className="flex items-start gap-4">
                    <span className="mt-1 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="text-base text-foreground/85 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. INGREDIENTS ============ */}
      <section ref={s.ing.ref} className="py-24 lg:py-32 bg-warm-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">INGREDIENTS</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Quality Starts With Ingredients
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Natural ingredients, balanced nutrition and controlled sourcing — every raw material is verified before it enters our production line.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {ingredientList.map((ing, i) => {
              const Icon = ing.icon;
              return (
                <div
                  key={ing.name}
                  className={`group p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 ${s.ing.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold-accent/15 text-gold-accent flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-accent group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2">{ing.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ing.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 7. EXPORT ADVANTAGES — COMPARISON ============ */}
      <section ref={s.cmp.ref} className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">EXPORT ADVANTAGES</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Traditional Supplier vs Naturino
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8 lg:p-10 bg-muted/40 border border-border">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-semibold">Traditional Supplier</span>
              </div>
              <ul className="space-y-4">
                {supplierCompare.traditional.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive/70 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-8 lg:p-10 bg-primary text-primary-foreground border-2 border-gold-accent shadow-warm-lg">
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 rounded-full bg-gold-accent text-foreground text-[10px] tracking-[0.2em] uppercase font-semibold">Naturino</span>
              </div>
              <ul className="space-y-4">
                {supplierCompare.naturino.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 8. PROCESS ============ */}
      <section ref={s.proc.ref} className="py-24 lg:py-32 bg-warm-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">PROCESS</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              How Cooperation Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.n}
                  className={`relative rounded-2xl bg-card border border-border p-7 hover:border-primary/40 hover:shadow-warm transition-all duration-500 ${s.proc.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-heading text-3xl text-muted-foreground/40">0{step.n}</span>
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 9. CERTIFICATIONS ============ */}
      <section ref={s.cert.ref} className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">CERTIFICATIONS</span>
            <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Certified for Global Trade
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {certifications.map((c, i) => (
              <div
                key={c.code}
                className={`group aspect-square rounded-2xl bg-card border border-border p-6 flex flex-col items-center justify-center text-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 ${s.cert.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-full border-2 border-gold-accent text-gold-accent flex items-center justify-center mb-4 group-hover:bg-gold-accent group-hover:text-foreground transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <div className="font-heading text-lg mb-1">{c.title}</div>
                <p className="text-[11px] leading-relaxed opacity-75">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 10. INSIGHTS / BLOG ============ */}
      <section ref={s.blog.ref} className="py-24 lg:py-32 bg-warm-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">INSIGHTS</span>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground">
                Industry Insights
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <article
                key={a.title}
                className={`group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-500 ${s.blog.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-7">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-primary font-semibold">{a.tag}</span>
                  <h3 className="mt-3 font-heading text-xl text-foreground leading-snug">{a.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 11. FAQ ============ */}
      <section ref={s.faq.ref} className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">FAQ</span>
              <h2 className="mt-4 font-heading text-4xl md:text-5xl leading-[1.1] text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Quick answers for distributors, importers and private-label partners. Need more detail? Our export team responds within 24 hours.
              </p>
            </div>
            <div className="lg:col-span-7">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-border bg-card px-6 data-[state=open]:border-primary/40 data-[state=open]:shadow-warm">
                    <AccordionTrigger className="text-left font-heading text-base lg:text-lg py-5 hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 12. FINAL CTA ============ */}
      <section ref={s.cta.ref} className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_70%_30%,white,transparent_55%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-10 h-10 text-gold-accent mx-auto mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              Let's Build Your Pet Food Brand
            </h2>
            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Our export team will respond within 24 hours with samples, pricing and a tailored proposal for your market.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild size="lg" className="rounded-2xl h-14 px-8 bg-gold-accent text-foreground hover:bg-gold-accent/90 text-sm tracking-wider uppercase shadow-xl">
                <Link to="/contact">Request Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl h-14 px-8 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white text-sm tracking-wider uppercase">
                <Link to="/contact"><MessageSquare className="w-4 h-4 mr-2" /> Contact Export Team</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-primary-foreground/75 pt-10 border-t border-primary-foreground/15">
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-gold-accent transition-colors">
                <Phone className="w-4 h-4" /> {contactPhone}
              </a>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 hover:text-gold-accent transition-colors">
                <Mail className="w-4 h-4" /> {contactEmail}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Tashkent, Uzbekistan
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
