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
    { href: '/', label: language === 'ru' ? 'Главная' : 'Bosh sahifa' },
    { href: '/catalog', label: language === 'ru' ? 'Каталог' : 'Katalog' },
    { href: '/about', label: language === 'ru' ? 'О бренде' : 'Brend haqida' },
    { href: '/faq', label: 'FAQ' },
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
        'sticky top-0 z-50 transition-all duration-500 border-b',
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-border/60 shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.12)]'
          : 'bg-background border-transparent',
      )}
    >
      {/* Top utility strip */}
      <div
        className={cn(
          'hidden md:block border-b border-border/40 bg-secondary/40 text-muted-foreground transition-all duration-500 overflow-hidden',
          scrolled ? 'max-h-0 opacity-0 border-transparent' : 'max-h-10 opacity-100',
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-9 text-[11px] tracking-[0.18em] uppercase">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-primary" />
                {address}
              </span>
              <span className="hidden lg:flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-primary" />
                {hours}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden lg:inline">
                {language === 'ru'
                  ? 'Бесплатная доставка по Ташкенту от 300 000 сум'
                  : 'Toshkent bo‘ylab 300 000 so‘mdan yuqori — yetkazib berish bepul'}
              </span>
              <a
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Phone className="w-3 h-3" />
                {contactPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-500',
            scrolled ? 'h-16' : 'h-20',
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
          <nav className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
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
