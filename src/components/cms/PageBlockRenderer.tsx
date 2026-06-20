import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getBlockIcon, tr, type BlockType } from '@/lib/pageBuilder';

interface PageBlockRendererProps {
  blockType: BlockType;
  data: any;
  lang: string;
  defaultLang: string;
}

const isExternal = (url: string) => /^https?:\/\//.test(url);

function CtaButton({ href, children }: { href: string; children: ReactNode }) {
  if (!href) return null;
  if (isExternal(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer"><Button size="lg">{children}</Button></a>;
  }
  return <Link to={href}><Button size="lg">{children}</Button></Link>;
}

export function PageBlockRenderer({ blockType, data, lang, defaultLang }: PageBlockRendererProps) {
  switch (blockType) {
    case 'hero': {
      const t = tr(data.translations, lang, defaultLang, { title: '', subtitle: '', description: '', button_text: '' });
      const hasImage = !!data.image;
      return (
        <section className="relative py-24 md:py-32 overflow-hidden">
          {hasImage && (
            <div className="absolute inset-0 z-0">
              <img src={data.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )}
          <div className={`container mx-auto px-4 relative z-10 text-center ${hasImage ? 'text-white' : ''}`}>
            {t.title && <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>}
            {t.subtitle && <p className="text-lg opacity-90 max-w-2xl mx-auto mb-2">{t.subtitle}</p>}
            {t.description && <p className="max-w-2xl mx-auto opacity-80 mb-6">{t.description}</p>}
            {t.button_text && data.button_url && <CtaButton href={data.button_url}>{t.button_text}</CtaButton>}
          </div>
        </section>
      );
    }

    case 'text': {
      const t = tr(data.translations, lang, defaultLang, { content: '' });
      if (!t.content) return null;
      return (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl prose prose-neutral">
            <ReactMarkdown>{t.content}</ReactMarkdown>
          </div>
        </section>
      );
    }

    case 'text_image': {
      const t = tr(data.translations, lang, defaultLang, { title: '', content: '' });
      const imageFirst = data.image_position === 'left';
      return (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={imageFirst ? 'lg:order-2' : ''}>
                {t.title && <h2 className="font-serif text-3xl font-bold mb-4">{t.title}</h2>}
                <div className="prose prose-neutral text-muted-foreground"><ReactMarkdown>{t.content}</ReactMarkdown></div>
              </div>
              {data.image && (
                <div className={`rounded-2xl overflow-hidden ${imageFirst ? 'lg:order-1' : ''}`}>
                  <img src={data.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    case 'features': {
      const items: any[] = data.items || [];
      if (items.length === 0) return null;
      return (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => {
                const t = tr(item.translations, lang, defaultLang, { title: '', description: '' });
                const Icon = getBlockIcon(item.icon);
                return (
                  <div key={item.id} className="text-center p-6 bg-card rounded-2xl shadow-warm">
                    <Icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                    {t.title && <h3 className="font-medium mb-2">{t.title}</h3>}
                    {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'stats': {
      const items: any[] = data.items || [];
      if (items.length === 0) return null;
      return (
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {items.map((item) => {
                const t = tr(item.translations, lang, defaultLang, { label: '' });
                return (
                  <div key={item.id} className="text-center p-6 bg-card rounded-2xl shadow-warm">
                    <div className="font-serif text-3xl font-bold text-foreground">{item.number}</div>
                    <div className="text-sm text-muted-foreground">{t.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'faq': {
      const items: any[] = data.items || [];
      if (items.length === 0) return null;
      return (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-2">
              {items.map((item) => {
                const t = tr(item.translations, lang, defaultLang, { question: '', answer: '' });
                return (
                  <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">{t.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>
      );
    }

    case 'cta': {
      const t = tr(data.translations, lang, defaultLang, { title: '', description: '', button_text: '' });
      const hasImage = !!data.background_image;
      return (
        <section className="relative py-20 overflow-hidden">
          {hasImage && (
            <div className="absolute inset-0 z-0">
              <img src={data.background_image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          )}
          <div className={`container mx-auto px-4 relative z-10 text-center ${hasImage ? 'text-white' : ''}`}>
            {t.title && <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">{t.title}</h2>}
            {t.description && <p className="max-w-2xl mx-auto opacity-90 mb-6">{t.description}</p>}
            {t.button_text && data.button_url && <CtaButton href={data.button_url}>{t.button_text}</CtaButton>}
          </div>
        </section>
      );
    }

    case 'gallery': {
      const items: any[] = data.items || [];
      if (items.length === 0) return null;
      return (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const t = tr(item.translations, lang, defaultLang, { caption: '' });
                return (
                  <figure key={item.id} className="rounded-2xl overflow-hidden">
                    <img src={item.image} alt={t.caption} className="w-full h-64 object-cover" />
                    {t.caption && <figcaption className="text-sm text-muted-foreground mt-2">{t.caption}</figcaption>}
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
