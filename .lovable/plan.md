
# Admin Panel CMS — Enterprise Restructure

Bu juda katta o'zgarish. Buni **6 bosqichga** bo'lib amalga oshiramiz, har biri alohida tasdiqlanadi. Pastda har bir bosqich qisqacha tushuntirilgan.

---

## Bosqich 1 — Sidebar va navigatsiya tuzilmasi (HOZIR)

Admin sidebar'ni guruhlangan menyu sifatida qayta qurish.

**Yangi tuzilma:**

```text
Dashboard
  ├── Dashboard
  └── Analytics

Sales
  ├── Orders
  ├── Customers
  └── Messages

Catalog
  ├── Products
  ├── Categories
  ├── Product Lines
  ├── Brands
  └── Attributes

Content (CMS)        ← yangi
  ├── Homepage
  ├── Pages
  ├── Blog
  └── FAQ

Marketing            ← yangi
  ├── SEO
  └── Banners

Settings
  ├── Languages
  ├── Checkout
  ├── Telegram
  └── Administrators
```

**Texnik:**
- `AdminLayout.tsx` `shadcn/ui Sidebar` (collapsible groups) ga o'tkaziladi
- `src/lib/permissions.ts` ga yangi modullar: `cms_pages`, `cms_blog`, `cms_faq`, `cms_homepage`, `marketing_seo`, `marketing_banners`, `settings_languages`, `settings_checkout`, `settings_telegram`
- Yangi route'lar uchun bo'sh "Coming soon" sahifalari yaratiladi (keyingi bosqichlarda to'ldiriladi)
- Mavjud sahifalar (Products, Orders va h.k.) tegishli guruhga ko'chiriladi

**Buziladigan narsa yo'q** — barcha eski URL'lar ishlashda davom etadi.

---

## Bosqich 2 — Pages CMS (asosiy CMS yadrosi)

`pages` + `page_sections` + `*_translations` jadvallari, page builder editor.

**Jadvallar:**
- `pages` (slug, status, featured_image, sort_order)
- `page_translations` (page_id, language_code, title, meta_title, meta_description, og_image, canonical_url)
- `page_sections` (page_id, type, sort_order, settings JSONB)
- `page_section_translations` (section_id, language_code, content JSONB)

**Section turlari:** `hero`, `stats`, `feature_cards`, `text_image`, `product_showcase`, `timeline`, `faq`, `cta`

**Admin UI:**
- `/admin/cms/pages` — jadval (Edit/Duplicate/Preview/Publish/Delete)
- `/admin/cms/pages/:id/edit` — drag-and-drop section builder, har bir section'ga `<TranslationTabs>` (UZ/RU/EN + dinamik)

**Default pages** seed qilinadi: Company, Private Label, Quality, Manufacturing, Export, Contact.

**Frontend:** mavjud statik sahifalar (`About`, `PrivateLabel`, `Sifat`, `IshlabChiqarish`, `Eksport`, `Contact`) CMS'dan ma'lumot oladigan section renderer'ga o'tkaziladi. Eski hardcoded matnlar fallback bo'lib qoladi.

---

## Bosqich 3 — Homepage CMS + Banners

- `/admin/cms/homepage` — Pages bilan bir xil section builder, lekin homepage uchun ajratilgan
- `/admin/marketing/banners` — hero sliders, promo bloklar (image, link, sort_order, active dates, language)
- `Index.tsx` CMS'dan o'qiydi

---

## Bosqich 4 — Blog + FAQ

**Blog:**
- `blog_posts`, `blog_post_translations`, `blog_categories`, `blog_tags`, `blog_post_tags`
- `/admin/cms/blog` — list + editor (rich text, featured image, SEO, publish date)
- Frontend: `/blog`, `/blog/:slug`

**FAQ:**
- `faq_categories`, `faqs`, `faq_translations`
- `/admin/cms/faq` — kategoriya bo'yicha guruhlangan accordion editor
- Frontend `FAQ.tsx` DB'dan o'qiydi

---

## Bosqich 5 — SEO Module + Telegram Settings

**SEO:**
- `/admin/marketing/seo` — har bir sahifa uchun markaziy SEO panel
- Global SEO defaults (sitewide title pattern, OG image, robots)
- `react-helmet-async` integratsiyasi (agar hali yo'q bo'lsa)

**Telegram:**
- `/admin/settings/telegram` — bot token, chat IDs, notification rules (yangi buyurtma, xabar, sotuvchi tayinlash)
- Mavjud `send-telegram` edge function bilan bog'lanadi

---

## Bosqich 6 — Permissions refactor

- `app_role` ga `editor` qo'shiladi (yoki mavjud `manager` qayta sozlanadi)
- `rolePermissions` quyidagicha:
  - **admin**: hammasi
  - **editor**: faqat CMS, Marketing, Languages
  - **manager**: faqat Sales (orders, customers, messages)
  - **seller**: hozirgidek
- `ProtectedRoute` har bir yangi modulni tekshiradi

---

## Multilingual eslatma

Bosqich 1 dan boshlab har bir yangi jadval `*_translations` pattern bilan quriladi. Faza 1 multilingual sistemamiz allaqachon o'rnatilgan — UZ/RU/EN va kelajakdagi tillar avtomatik ishlaydi.

---

## Hozir nima bo'ladi?

**Faqat Bosqich 1** — sidebar va navigatsiya. Hech qanday backend yoki sahifa funksionalligi buzilmaydi. Yangi CMS sahifalari "Tez orada" placeholder bilan ochiladi.

Tasdiqlasangiz, Bosqich 1 ni boshlayman. Keyingi bosqichlar har birini alohida tasdiqlaysiz.
