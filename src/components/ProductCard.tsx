import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { LazyImage } from '@/components/LazyImage';
import type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product | {
    id: string;
    name_uz: string;
    name_ru: string;
    price: number;
    originalPrice?: number;
    images: string[];
    rating?: number;
    reviewCount?: number;
    slug?: string | null;
    original_price?: number | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const name = language === 'uz' ? product.name_uz : product.name_ru;
  const formatPrice = (price: number) => price.toLocaleString('uz-UZ');

  const price = product.price || 0;
  const originalPrice = 'originalPrice' in product ? product.originalPrice : (product as any).original_price;
  const images = product.images || [];
  const productUrl = 'slug' in product && product.slug
    ? `/product/${product.slug}`
    : `/product/${product.id}`;

  const p = product as any;
  const inStock = p.in_stock !== false;
  const vetRecommended = p.vet_recommended === true;

  // Eyebrow: pet type · food format (e.g. "IT · QURUQ")
  const eyebrowParts = [
    p.pet_type || p.application?.[0],
    p.materials?.[0] || p.colors?.[0],
  ].filter(Boolean) as string[];
  const eyebrow = eyebrowParts.slice(0, 2).join(' · ').toUpperCase();

  // Stat row (PROTEIN · QADOQ · SAQLASH)
  const protein = p.protein || p.protein_percent || '—';
  const packaging = (p.fur_length?.length ? p.fur_length.join(', ') : null)
    || p.package_size
    || '—';
  const shelfLife = p.shelf_life
    || (p.application?.[1] ?? null)
    || '—';

  const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm-lg">
      <Link to={productUrl} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <LazyImage
          src={images[0] || '/placeholder.svg'}
          alt={name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          wrapperClassName="w-full h-full"
        />
        {originalPrice && originalPrice > price && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
            -{Math.round((1 - price / originalPrice) * 100)}%
          </span>
        )}
        {vetRecommended && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-medium text-white">
            🩺 Vet
          </span>
        )}
        {!inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold uppercase tracking-wider text-white">
            {language === 'ru' ? 'Нет в наличии' : 'Tugagan'}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {eyebrow && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </div>
        )}
        <Link to={productUrl}>
          <h3 className="mb-4 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors hover:text-primary">
            {name}
          </h3>
        </Link>

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-center">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {language === 'ru' ? 'Белок' : 'Protein'}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{protein}</div>
          </div>
          <div className="border-x border-border/60">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {language === 'ru' ? 'Упаковка' : 'Qadoq'}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{truncate(String(packaging), 14)}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {language === 'ru' ? 'Хранение' : 'Saqlash'}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{shelfLife}</div>
          </div>
        </div>

        {(price > 0 || inStock) && (
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            {price > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg font-bold text-foreground">{formatPrice(price)}</span>
                <span className="text-xs text-muted-foreground">{t.products.currency}</span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
                )}
              </div>
            ) : (
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {language === 'ru' ? 'По запросу' : "Narx so'rov bo'yicha"}
              </span>
            )}
            <Button
              size="sm"
              variant={inCart ? 'secondary' : 'default'}
              className="rounded-full"
              disabled={!inStock}
              onClick={(e) => {
                e.preventDefault();
                if (!inStock || inCart) return;
                addItem({
                  id: product.id,
                  name_uz: product.name_uz,
                  name_ru: product.name_ru,
                  price,
                  images,
                } as any);
              }}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
