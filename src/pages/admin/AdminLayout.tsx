import { useState, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Palette,
  FolderTree,
  Users,
  Shield,
  FileText,
  ClipboardList,
  Settings2,
  MessageSquare,
  Award,
  Sliders,
  BarChart3,
  Layers,
  ChevronDown,
  Home,
  Files,
  Newspaper,
  HelpCircle,
  Search,
  Image as ImageIcon,
  Languages,
  Send,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { RolePermissions, roleDisplayInfo } from '@/lib/permissions';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  module: keyof RolePermissions;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, module: 'dashboard' },
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3, module: 'analytics' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { title: 'Buyurtmalar', url: '/admin/orders', icon: ShoppingCart, module: 'orders' },
      { title: 'Mijozlar', url: '/admin/customers', icon: Users, module: 'customers' },
      { title: 'Xabarlar', url: '/admin/messages', icon: MessageSquare, module: 'customers' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { title: 'Mahsulotlar', url: '/admin/products', icon: Package, module: 'products' },
      { title: 'Toifalar', url: '/admin/categories', icon: FolderTree, module: 'categories' },
      { title: 'Mahsulot liniyalari', url: '/admin/product-lines', icon: Layers, module: 'brands' },
      { title: 'Brendlar', url: '/admin/brands', icon: Award, module: 'brands' },
      { title: 'Atributlar', url: '/admin/attributes', icon: Sliders, module: 'attributes' },
    ],
  },
  {
    label: 'Content (CMS)',
    items: [
      { title: 'Homepage', url: '/admin/cms/homepage', icon: Home, module: 'cms_homepage' },
      { title: 'Sahifalar', url: '/admin/cms/pages', icon: Files, module: 'cms_pages' },
      { title: 'Blog', url: '/admin/cms/blog', icon: Newspaper, module: 'cms_blog' },
      { title: 'FAQ', url: '/admin/cms/faq', icon: HelpCircle, module: 'cms_faq' },
      { title: 'Sayt kontenti (legacy)', url: '/admin/content', icon: FileText, module: 'siteContent' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { title: 'SEO', url: '/admin/marketing/seo', icon: Search, module: 'marketing_seo' },
      { title: 'Bannerlar', url: '/admin/marketing/banners', icon: ImageIcon, module: 'marketing_banners' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { title: 'Tillar', url: '/admin/settings/languages', icon: Languages, module: 'settings_languages' },
      { title: 'Checkout formasi', url: '/admin/checkout-form', icon: ClipboardList, module: 'settings_checkout' },
      { title: 'Telegram', url: '/admin/settings', icon: Send, module: 'telegram' },
      { title: 'Mavzular', url: '/admin/themes', icon: Palette, module: 'themes' },
      { title: 'Adminlar', url: '/admin/admins', icon: Shield, module: 'admins' },
      { title: 'Tizim sozlamalari', url: '/admin/system', icon: Settings2, module: 'systemSettings' },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { canViewModule, userRole, user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const visibleGroups = useMemo(() => {
    return navGroups
      .map((g) => ({ ...g, items: g.items.filter((i) => canViewModule(i.module)) }))
      .filter((g) => g.items.length > 0);
  }, [canViewModule, userRole]);

  // Track open/closed groups; default = group with active route is open, others open too on first load
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (label: string) =>
    setCollapsedGroups((s) => ({ ...s, [label]: !s[label] }));

  const roleInfo = userRole ? roleDisplayInfo[userRole] : null;

  const renderNav = (onNavigate?: () => void) => (
    <nav className="p-3 space-y-1">
      {visibleGroups.map((group) => {
        const collapsed = collapsedGroups[group.label] ?? false;
        const groupHasActive = group.items.some((i) => isActive(i.url));
        return (
          <div key={group.label} className="mb-2">
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
            >
              <span>{group.label}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  collapsed && '-rotate-90'
                )}
              />
            </button>
            {!collapsed && (
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive(item.url)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
            {collapsed && groupHasActive && (
              <div className="h-0.5 w-8 bg-primary mx-3 rounded-full" />
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b flex items-center justify-between px-4 lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/admin" className="font-serif text-lg font-bold text-primary">
          Admin Panel
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform lg:hidden flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
          <Link to="/admin" className="font-serif text-xl font-bold text-primary">
            Admin Panel
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {roleInfo && (
          <div className="p-4 border-b flex-shrink-0">
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            <Badge className={cn('mt-1', roleInfo.color)}>{roleInfo.label}</Badge>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{renderNav(() => setSidebarOpen(false))}</div>

        <div className="p-4 border-t space-y-2 flex-shrink-0">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate('/')}>
            <LogOut className="h-4 w-4" />
            Saytga qaytish
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={async () => {
              await signOut();
              navigate('/admin/auth');
            }}
          >
            <LogOut className="h-4 w-4" />
            Admindan chiqish
          </Button>
        </div>
      </aside>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen">
        <aside className="w-64 bg-white border-r fixed inset-y-0 left-0 flex flex-col">
          <div className="flex items-center h-16 px-6 border-b flex-shrink-0">
            <Link to="/admin" className="font-serif text-xl font-bold text-primary">
              Admin Panel
            </Link>
          </div>

          {roleInfo && (
            <div className="p-4 border-b flex-shrink-0">
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              <Badge className={cn('mt-1', roleInfo.color)}>{roleInfo.label}</Badge>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">{renderNav()}</div>

          <div className="p-4 border-t mt-auto space-y-2 flex-shrink-0">
            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate('/')}>
              <LogOut className="h-4 w-4" />
              Saytga qaytish
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start gap-3"
              onClick={async () => {
                await signOut();
                navigate('/admin/auth');
              }}
            >
              <LogOut className="h-4 w-4" />
              Admindan chiqish
            </Button>
          </div>
        </aside>

        <div className="w-64 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 h-16 bg-white border-b flex items-center justify-end px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <main className="p-4 lg:hidden">
        <Outlet />
      </main>
    </div>
  );
}
