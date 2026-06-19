import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';

interface InfoBlock {
  title: { uz: string; ru: string };
  body: { uz: string; ru: string };
}

interface InfoPageProps {
  eyebrow: { uz: string; ru: string };
  title: { uz: string; ru: string };
  lead: { uz: string; ru: string };
  heroImage: string;
  blocks: InfoBlock[];
  stats?: { value: string; label: { uz: string; ru: string } }[];
  ctaText?: { uz: string; ru: string };
}

export function InfoPage({ eyebrow, title, lead, heroImage, blocks, stats, ctaText }: InfoPageProps) {
  const { language } = useLanguage();
  const t = (v: { uz: string; ru: string }) => v[language] ?? v.uz;

  useSEO({
    title: `${t(title)} — PETFOOD MARKET`,
    description: t(lead).slice(0, 155),
  });

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img src={heroImage} alt={t(title)} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative container mx-auto px-4 lg:px-8 pb-12 lg:pb-20 text-white">
          <p className="text-[11px] tracking-[0.3em] uppercase text-primary-foreground/80 mb-4">{t(eyebrow)}</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] max-w-4xl">
            {t(title)}
          </h1>
        </div>
      </section>

      {/* Lead */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t(lead)}</p>
        </div>
      </section>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <section className="border-y border-border/60 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-serif text-3xl md:text-4xl font-bold text-foreground">{s.value}</div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
                    {t(s.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blocks */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid gap-12 md:gap-16">
          {blocks.map((b, i) => (
            <div key={i} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start border-t border-border/60 pt-10">
              <div className="md:col-span-4">
                <span className="font-mono text-xs text-muted-foreground/70">0{i + 1}</span>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mt-3 leading-tight">
                  {t(b.title)}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {t(b.body)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h3 className="font-serif text-2xl md:text-3xl max-w-xl">
            {ctaText
              ? t(ctaText)
              : language === 'ru'
              ? 'Готовы обсудить сотрудничество?'
              : 'Hamkorlikni muhokama qilishga tayyormisiz?'}
          </h3>
          <Button
            asChild
            className="rounded-none h-12 px-8 text-[11px] tracking-[0.25em] uppercase bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/contact">
              {language === 'ru' ? 'Связаться' : 'Bog‘lanish'} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default InfoPage;
