import {
  Layout, AlignLeft, Image as ImageIcon, LayoutGrid, BarChart3, HelpCircle, Megaphone, Images,
  Award, Package, Users, MapPin, Shield, Truck, Star, Check, Heart, Leaf, Droplet, Sun, Zap, Clock, Phone, Mail,
  type LucideIcon,
} from 'lucide-react';

export type BlockType = 'hero' | 'text' | 'text_image' | 'features' | 'stats' | 'faq' | 'cta' | 'gallery';

export type TranslationMap<T> = Record<string, T>;

export interface HeroTranslated { title: string; subtitle: string; description: string; button_text: string }
export interface HeroData { image: string; button_url: string; translations: TranslationMap<HeroTranslated> }

export interface TextTranslated { content: string }
export interface TextData { translations: TranslationMap<TextTranslated> }

export interface TextImageTranslated { title: string; content: string }
export interface TextImageData { image: string; image_position: 'left' | 'right'; translations: TranslationMap<TextImageTranslated> }

export interface FeatureItem { id: string; icon: string; translations: TranslationMap<{ title: string; description: string }> }
export interface FeaturesData { items: FeatureItem[] }

export interface StatItem { id: string; number: string; translations: TranslationMap<{ label: string }> }
export interface StatsData { items: StatItem[] }

export interface FaqBlockItem { id: string; translations: TranslationMap<{ question: string; answer: string }> }
export interface FaqBlockData { items: FaqBlockItem[] }

export interface CtaTranslated { title: string; description: string; button_text: string }
export interface CtaData { button_url: string; background_image: string; translations: TranslationMap<CtaTranslated> }

export interface GalleryItem { id: string; image: string; translations: TranslationMap<{ caption: string }> }
export interface GalleryData { items: GalleryItem[] }

export type BlockData = HeroData | TextData | TextImageData | FeaturesData | StatsData | FaqBlockData | CtaData | GalleryData;

export interface BlockDef {
  type: BlockType;
  label: string;
  icon: LucideIcon;
}

export const BLOCK_DEFS: BlockDef[] = [
  { type: 'hero', label: 'Hero', icon: Layout },
  { type: 'text', label: 'Matn', icon: AlignLeft },
  { type: 'text_image', label: 'Matn + Rasm', icon: ImageIcon },
  { type: 'features', label: 'Xususiyatlar', icon: LayoutGrid },
  { type: 'stats', label: 'Statistika', icon: BarChart3 },
  { type: 'faq', label: 'FAQ', icon: HelpCircle },
  { type: 'cta', label: 'CTA', icon: Megaphone },
  { type: 'gallery', label: 'Galereya', icon: Images },
];

export const BLOCK_LABELS: Record<BlockType, string> = BLOCK_DEFS.reduce(
  (acc, b) => ({ ...acc, [b.type]: b.label }),
  {} as Record<BlockType, string>,
);

export const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'Award', label: 'Mukofot', icon: Award },
  { value: 'Package', label: 'Quti', icon: Package },
  { value: 'Users', label: 'Foydalanuvchilar', icon: Users },
  { value: 'MapPin', label: 'Manzil', icon: MapPin },
  { value: 'Shield', label: 'Qalqon', icon: Shield },
  { value: 'Truck', label: 'Yetkazib berish', icon: Truck },
  { value: 'Star', label: 'Yulduz', icon: Star },
  { value: 'Check', label: 'Belgi', icon: Check },
  { value: 'Heart', label: 'Yurak', icon: Heart },
  { value: 'Leaf', label: 'Barg', icon: Leaf },
  { value: 'Droplet', label: 'Tomchi', icon: Droplet },
  { value: 'Sun', label: 'Quyosh', icon: Sun },
  { value: 'Zap', label: 'Chaqmoq', icon: Zap },
  { value: 'Clock', label: 'Soat', icon: Clock },
  { value: 'Phone', label: 'Telefon', icon: Phone },
  { value: 'Mail', label: 'Pochta', icon: Mail },
];

export function getBlockIcon(name: string): LucideIcon {
  return ICON_OPTIONS.find((o) => o.value === name)?.icon || Star;
}

export const genId = () => crypto.randomUUID();

function emptyTranslations<T extends object>(langCodes: string[], empty: T): TranslationMap<T> {
  return langCodes.reduce((acc, code) => ({ ...acc, [code]: { ...empty } }), {} as TranslationMap<T>);
}

export function createDefaultBlockData(type: BlockType, langCodes: string[]): BlockData {
  switch (type) {
    case 'hero':
      return { image: '', button_url: '', translations: emptyTranslations(langCodes, { title: '', subtitle: '', description: '', button_text: '' }) } as HeroData;
    case 'text':
      return { translations: emptyTranslations(langCodes, { content: '' }) } as TextData;
    case 'text_image':
      return { image: '', image_position: 'right', translations: emptyTranslations(langCodes, { title: '', content: '' }) } as TextImageData;
    case 'features':
      return { items: [] } as FeaturesData;
    case 'stats':
      return { items: [] } as StatsData;
    case 'faq':
      return { items: [] } as FaqBlockData;
    case 'cta':
      return { button_url: '', background_image: '', translations: emptyTranslations(langCodes, { title: '', description: '', button_text: '' }) } as CtaData;
    case 'gallery':
      return { items: [] } as GalleryData;
  }
}

export function createDefaultItem(type: 'features' | 'stats' | 'faq' | 'gallery', langCodes: string[]) {
  switch (type) {
    case 'features':
      return { id: genId(), icon: 'Star', translations: emptyTranslations(langCodes, { title: '', description: '' }) } as FeatureItem;
    case 'stats':
      return { id: genId(), number: '', translations: emptyTranslations(langCodes, { label: '' }) } as StatItem;
    case 'faq':
      return { id: genId(), translations: emptyTranslations(langCodes, { question: '', answer: '' }) } as FaqBlockItem;
    case 'gallery':
      return { id: genId(), image: '', translations: emptyTranslations(langCodes, { caption: '' }) } as GalleryItem;
  }
}

/** Safely read a translated field, falling back to the default language, then to a blank value. */
export function tr<T extends object>(map: TranslationMap<T> | undefined, lang: string, fallbackLang: string, empty: T): T {
  if (!map) return empty;
  return map[lang] || map[fallbackLang] || Object.values(map)[0] || empty;
}
