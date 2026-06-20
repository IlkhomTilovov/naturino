// Role-based Access Control (RBAC) permissions configuration

export type AppRole = 'admin' | 'manager' | 'seller';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermissions {
  dashboard: Permission;
  orders: Permission;
  categories: Permission;
  brands: Permission;
  attributes: Permission;
  products: Permission;
  customers: Permission;
  siteContent: Permission;
  themes: Permission;
  admins: Permission;
  telegram: Permission;
  systemSettings: Permission;
  analytics: Permission;
  // CMS
  cms_homepage: Permission;
  cms_pages: Permission;
  cms_blog: Permission;
  cms_faq: Permission;
  // Marketing
  marketing_seo: Permission;
  marketing_banners: Permission;
  // Settings sub-modules
  settings_languages: Permission;
  settings_checkout: Permission;
}

const noPerm: Permission = { view: false, create: false, edit: false, delete: false };
const fullPerm: Permission = { view: true, create: true, edit: true, delete: true };
const readPerm: Permission = { view: true, create: false, edit: false, delete: false };

export const rolePermissions: Record<AppRole, RolePermissions> = {
  seller: {
    dashboard: readPerm,
    orders: { view: true, create: true, edit: true, delete: false },
    categories: noPerm,
    brands: noPerm,
    attributes: noPerm,
    products: noPerm,
    customers: readPerm,
    siteContent: noPerm,
    themes: noPerm,
    admins: noPerm,
    telegram: noPerm,
    systemSettings: noPerm,
    analytics: noPerm,
    cms_homepage: noPerm,
    cms_pages: noPerm,
    cms_blog: noPerm,
    cms_faq: noPerm,
    marketing_seo: noPerm,
    marketing_banners: noPerm,
    settings_languages: noPerm,
    settings_checkout: noPerm,
  },
  manager: {
    dashboard: readPerm,
    orders: noPerm,
    categories: fullPerm,
    brands: fullPerm,
    attributes: fullPerm,
    products: fullPerm,
    customers: noPerm,
    siteContent: fullPerm,
    themes: fullPerm,
    admins: noPerm,
    telegram: fullPerm,
    systemSettings: noPerm,
    analytics: noPerm,
    cms_homepage: fullPerm,
    cms_pages: fullPerm,
    cms_blog: fullPerm,
    cms_faq: fullPerm,
    marketing_seo: fullPerm,
    marketing_banners: fullPerm,
    settings_languages: readPerm,
    settings_checkout: fullPerm,
  },
  admin: {
    dashboard: fullPerm,
    orders: fullPerm,
    categories: fullPerm,
    brands: fullPerm,
    attributes: fullPerm,
    products: fullPerm,
    customers: fullPerm,
    siteContent: fullPerm,
    themes: fullPerm,
    admins: fullPerm,
    telegram: fullPerm,
    systemSettings: fullPerm,
    analytics: fullPerm,
    cms_homepage: fullPerm,
    cms_pages: fullPerm,
    cms_blog: fullPerm,
    cms_faq: fullPerm,
    marketing_seo: fullPerm,
    marketing_banners: fullPerm,
    settings_languages: fullPerm,
    settings_checkout: fullPerm,
  },
};

export function hasPermission(
  role: AppRole | null,
  module: keyof RolePermissions,
  action: keyof Permission
): boolean {
  if (!role) return false;
  return rolePermissions[role]?.[module]?.[action] ?? false;
}

export function canViewModule(role: AppRole | null, module: keyof RolePermissions): boolean {
  return hasPermission(role, module, 'view');
}

export const roleDisplayInfo: Record<AppRole, { label: string; description: string; color: string }> = {
  seller: {
    label: 'Sotuvchi',
    description: 'Buyurtmalar va mijozlarni boshqarish',
    color: 'bg-blue-100 text-blue-800',
  },
  manager: {
    label: 'Menejer',
    description: 'Mahsulotlar va kontentni boshqarish',
    color: 'bg-green-100 text-green-800',
  },
  admin: {
    label: 'Admin',
    description: "To'liq ruxsat - barcha bo'limlar",
    color: 'bg-red-100 text-red-800',
  },
};

export interface NavItemConfig {
  title: string;
  url: string;
  icon: string;
  module: keyof RolePermissions;
}

export const navItemConfigs: NavItemConfig[] = [
  { title: 'Dashboard', url: '/admin', icon: 'LayoutDashboard', module: 'dashboard' },
  { title: 'Buyurtmalar', url: '/admin/orders', icon: 'ShoppingCart', module: 'orders' },
  { title: 'Brendlar', url: '/admin/brands', icon: 'Award', module: 'brands' },
  { title: 'Toifalar', url: '/admin/categories', icon: 'FolderTree', module: 'categories' },
  { title: 'Mahsulotlar', url: '/admin/products', icon: 'Package', module: 'products' },
  { title: 'Mijozlar', url: '/admin/customers', icon: 'Users', module: 'customers' },
  { title: 'Sayt kontenti', url: '/admin/content', icon: 'FileText', module: 'siteContent' },
  { title: 'Mavzular', url: '/admin/themes', icon: 'Palette', module: 'themes' },
  { title: 'Adminlar', url: '/admin/admins', icon: 'Shield', module: 'admins' },
  { title: 'Telegram', url: '/admin/settings', icon: 'Settings', module: 'telegram' },
  { title: 'Tizim sozlamalari', url: '/admin/system', icon: 'Settings2', module: 'systemSettings' },
];
