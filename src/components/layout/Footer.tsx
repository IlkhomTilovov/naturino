import { Link } from 'react-router-dom';
import { Phone, Send, Instagram, Clock, MapPin, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { EditableText } from '@/components/EditableText';
import { EditableLink } from '@/components/EditableLink';

export function Footer() {
  const { language } = useLanguage();
  const { settings, getAddress, getWorkingHours } = useSystemSettings();

  const contactPhone = settings?.contact_phone || '+998 90 123 45 67';
  const address = getAddress(language);
  const workingHours = getWorkingHours(language);

  const navLinks = [
    { to: '/', label: language === 'ru' ? 'Главная' : 'Bosh sahifa' },
    { to: '/catalog', label: language === 'ru' ? 'Каталог' : 'Katalog' },
    { to: '/about', label: language === 'ru' ? 'О нас' : 'Biz haqimizda' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: language === 'ru' ? 'Контакты' : 'Aloqa' },
  ];

  return (
    <footer className="bg-warm-cream border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">
                Petfood <span className="text-accent">Market</span>
              </span>
            </Link>
            <EditableText
              contentKey="footer_description"
              fallback={language === 'ru'
                ? 'Премиум корма и аксессуары для собак и кошек. Быстрая доставка по Ташкенту и регионам.'
                : "It va mushuklar uchun premium ozuqalar va aksessuarlar. Toshkent va viloyatlar bo'ylab tez yetkazib berish."}
              as="p"
              className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm font-medium opacity-90"
              multiline
              section="footer"
            />
            <div className="flex space-x-4 pt-2">
              <EditableLink
                contentKey="footer_social_telegram"
                fallback={settings?.social_telegram || '#'}
                className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center transition-transform hover:-translate-y-1 hover:bg-accent"
                section="footer"
              >
                <Send className="w-5 h-5 text-white" />
              </EditableLink>
              <EditableLink
                contentKey="footer_social_instagram"
                fallback={settings?.social_instagram || '#'}
                className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center transition-transform hover:-translate-y-1 hover:bg-accent"
                section="footer"
              >
                <Instagram className="w-5 h-5 text-white" />
              </EditableLink>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 flex flex-col space-y-6">
            <EditableText
              contentKey="footer_nav_title"
              fallback="Sahifalar"
              as="h4"
              className="font-serif text-xl font-bold text-foreground uppercase tracking-widest"
              section="footer"
            />
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-accent transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 flex flex-col space-y-6">
            <EditableText
              contentKey="footer_contact_title"
              fallback="Bog'lanish"
              as="h4"
              className="font-serif text-xl font-bold text-foreground uppercase tracking-widest"
              section="footer"
            />
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <EditableText
                  contentKey="footer_address"
                  fallback={address || "Toshkent sh., Yunusobod tumani"}
                  as="span"
                  className="text-muted-foreground text-sm leading-relaxed"
                  multiline
                  section="footer"
                />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <EditableText
                  contentKey="footer_phone"
                  fallback={contactPhone}
                  as="span"
                  className="text-foreground font-bold text-sm"
                  section="footer"
                />
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <EditableText
                  contentKey="footer_working_hours"
                  fallback={workingHours || "Dush–Shan: 09:00–18:00"}
                  as="span"
                  className="text-muted-foreground text-xs leading-tight"
                  multiline
                  section="footer"
                />
              </div>
              <div className="pt-2">
                <Link
                  to="/stats"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-accent border-b border-accent pb-1 hover:text-foreground hover:border-foreground transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  Sayt statistikasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            © {new Date().getFullYear()}{' '}
            <EditableText
              contentKey="footer_copyright"
              fallback={language === 'ru' ? 'PETFOOD MARKET. Все права защищены.' : 'PETFOOD MARKET. Barcha huquqlar himoyalangan.'}
              as="span"
              className="text-xs"
              section="footer"
            />
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-[10px] uppercase tracking-tighter text-muted-foreground hover:text-accent transition-colors"
            >
              {language === 'ru' ? 'Политика конфиденциальности' : "Maxfiylik siyosati"}
            </Link>
            <Link
              to="/terms"
              className="text-[10px] uppercase tracking-tighter text-muted-foreground hover:text-accent transition-colors"
            >
              {language === 'ru' ? 'Публичная оферта' : "Foydalanish shartlari"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
