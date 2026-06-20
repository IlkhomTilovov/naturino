import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Phone, Search, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { CartDrawer } from '@/components/CartDrawer';
import { cn } from '@/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();
  const location = useLocation();
  const { settings } = useSystemSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/about', label: language === 'ru' ? 'Компания' : 'Kompaniya' },
    { href: '/catalog', label: language === 'ru' ? 'Продукция' : 'Mahsulotlar' },
    { href: '/private-label', label: 'Private Label' },
    { href: '/sifat', label: language === 'ru' ? 'Качество' : 'Sifat' },
    { href: '/ishlab-chiqarish', label: language === 'ru' ? 'Производство' : 'Ishlab chiqarish' },
    { href: '/eksport', label: language === 'ru' ? 'Экспорт' : 'Eksport' },
    { href: '/contact', label: language === 'ru' ? 'Контакты' : 'Aloqa' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const contactPhone = settings?.contact_phone || '+998 90 123 45 67';
  const address = (language === 'ru' ? settings?.address_ru : settings?.address_uz) || 'Toshkent';
  const hours = (language === 'ru' ? settings?.working_hours_ru : settings?.working_hours_uz) || '09:00 — 21:00';

  return (
    <header
      className={cn(
        'fixed left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'top-2 px-2 sm:px-4' : 'top-4 px-3 sm:px-6',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-[1400px] rounded-2xl border transition-all duration-500',
          scrolled
            ? 'bg-background/85 backdrop-blur-xl border-border/60 shadow-[0_10px_40px_-12px_hsl(var(--foreground)/0.18)]'
            : 'bg-background/40 backdrop-blur-md border-white/20 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]',
        )}
      >
      {/* Main bar */}
      <div className="px-4 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-500',
            scrolled ? 'h-14' : 'h-16',
          )}
        >

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-serif text-xl md:text-2xl lg:text-[26px] font-bold tracking-[0.04em] text-foreground leading-none">
              PETFOOD
              <span className="text-primary"> MARKET</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'group relative text-[11px] font-medium tracking-[0.22em] uppercase py-2 transition-colors duration-300',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'pointer-events-none absolute left-0 -bottom-0.5 h-[1.5px] bg-primary transition-all duration-500',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Search */}
            <Link
              to="/catalog"
              aria-label="Search"
              className="hidden sm:flex w-9 h-9 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-[18px] h-[18px]" />
            </Link>

            {/* Language toggle */}
            <div className="hidden sm:flex items-center text-[11px] font-medium tracking-[0.15em]">
              <button
                onClick={() => setLanguage('uz')}
                className={cn(
                  'px-2 py-1 transition-colors',
                  language === 'uz' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                UZ
              </button>
              <span className="text-border">/</span>
              <button
                onClick={() => setLanguage('ru')}
                className={cn(
                  'px-2 py-1 transition-colors',
                  language === 'ru' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                RU
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen((prev) => !prev)}
              aria-label="Cart"
              className="relative w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-[20px] h-[20px]" strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA */}
            <Button
              asChild
              className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 px-5 text-[11px] tracking-[0.22em] uppercase font-medium ml-1"
            >
              <Link to="/contact">{language === 'ru' ? 'Заказать' : 'Buyurtma'}</Link>
            </Button>

            {/* Mobile menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          'lg:hidden overflow-hidden border-t border-border/40 bg-background transition-[max-height,opacity] duration-500',
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="container mx-auto px-4 py-6">
          <div className="flex flex-col">
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center justify-between py-4 border-b border-border/40 text-sm tracking-[0.2em] uppercase transition-colors',
                    active ? 'text-primary' : 'text-foreground hover:text-primary',
                  )}
                >
                  <span>
                    <span className="text-muted-foreground/60 text-[10px] mr-3 font-mono">
                      0{i + 1}
                    </span>
                    {link.label}
                  </span>
                  <span className="text-muted-foreground">→</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            <a
              href={`tel:${contactPhone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" /> {contactPhone}
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> {address}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> {hours}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={() => setLanguage('uz')}
              className={cn(
                'flex-1 py-2 text-xs tracking-[0.2em] uppercase border',
                language === 'uz'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground',
              )}
            >
              O‘zbekcha
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={cn(
                'flex-1 py-2 text-xs tracking-[0.2em] uppercase border',
                language === 'ru'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground',
              )}
            >
              Русский
            </button>
          </div>

          <Button
            asChild
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 text-[11px] tracking-[0.25em] uppercase"
          >
            <Link to="/contact">{language === 'ru' ? 'Заказать' : 'Buyurtma berish'}</Link>
          </Button>
        </nav>
      </div>

      {createPortal(
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />,
        document.body,
      )}
    </header>
  );
}
