
# Multilingual tizim — bosqichli reja

Tushundim: tillarni o'zingiz qo'shasiz, men faqat **infratuzilma** va **bo'sh boshqaruv panelini** yarataman. Hech qanday til seed qilinmaydi.

Bu juda katta o'zgarish (10+ jadval, butun admin va frontend). Buni **5 bosqichga** ajratdim. Har bir bosqich alohida tasdiqlanadi va alohida yetkazib beriladi — chunki hammasini birdan qilish saytni sindirib qo'yadi.

---

## 1-bosqich — Languages infratuzilmasi (HOZIR)

**Maqsad:** Til boshqaruvi to'liq ishlasin. Boshqa narsa o'zgarmaydi. Sayt UZ/RU bilan ishlashda davom etadi.

### Database
`languages` jadvali:
- `id`, `code` (unique, masalan `uz`), `name` (`English`), `native_name` (`O'zbekcha`), `flag` (emoji yoki label), `is_active` (bool), `is_default` (bool, faqat bittasi), `sort_order` (int), `created_at`, `updated_at`
- Trigger: `is_default=true` qilinganda boshqalarini `false`ga o'tkazadi
- RLS: hamma o'qiy oladi (`anon`+`authenticated`), faqat admin yoza oladi (`has_role('admin')`)
- **Boshlang'ich ma'lumot YO'Q** — jadval bo'sh keladi, o'zingiz qo'shasiz

### Admin sahifa
`/admin/system-settings` ichidagi mavjud "Til sozlamalari" kartasini to'liq qayta yozaman:
- "+ Til qo'shish" tugmasi → modal: code, name, native_name, flag
- Har bir til qatori: native_name (code), flag, [default radio], [active switch], [drag handle], [edit], [delete]
- Drag-and-drop tartibi (`@dnd-kit` — loyihada bor)
- Default tilni o'chirib bo'lmaydi
- Hech bo'lmaganda 1 ta faol til bo'lishi kerak

### Frontend
- `useLanguage` hook'i `languages` jadvalini o'qiydi (faol tillarni `sort_order` bo'yicha)
- Header'dagi til switcher dinamik — DBdan keladi
- Agar jadval bo'sh bo'lsa, hozirgi UZ/RU fallback ishlaydi (sayt buzilmasligi uchun)
- localStorage'da tanlangan til saqlanadi

### Buzilmaydigan narsalar
- `name_uz`, `name_ru` columnlar tegmaydi
- Mavjud `useLanguage` API'si (`t()`, `language`, `setLanguage`) o'sha-o'sha qoladi
- Hozirgi tarjimalar (`src/lib/translations.ts`) ishlaydi

---

## 2-bosqich — Translations jadvallari + URL prefiks (keyingi bosqich)

Tasdiqlangach quraman:
- `product_translations`, `category_translations`, `product_line_translations`, `brand_translations`, `attribute_translations`, `attribute_option_translations`, `checkout_field_translations`, `site_content.translations` (JSONB)
- Mavjud `name_uz`/`name_ru`/`description_uz`/`description_ru` ma'lumotlarini yangi jadvallarga ko'chirish (eski columnlar fallback uchun bir muddat qoladi)
- Fallback logikasi: tanlangan til → default til → birinchi mavjud
- React Router'ga `/:lang` prefiks (`/uz/catalog`, `/ru/catalog`), eski URL'lar default tilga redirect
- `hreflang` teglar (`react-helmet-async`)
- Sitemap multilingual

---

## 3-bosqich — Admin formalar (til tablari)

- `<TranslationTabs>` umumiy komponent: faol tillarni DBdan oladi, har til uchun tab chiqaradi
- To'ldirilganlik indikatori: ✅ to'liq, ⚠️ yetishmayapti, default til majburiy
- Mahsulot, kategoriya, brend, product line, atribut formalariga integratsiya
- ProductsNew.tsx, Categories.tsx, Brands.tsx, ProductLines.tsx, Attributes.tsx, CheckoutFormSettings.tsx, SiteContent.tsx

---

## 4-bosqich — Frontend kontent

- Barcha sahifalar yangi translations jadvallaridan o'qishi
- ProductCard, ProductDetails, Catalog, Category, ProductLine, BrandDetails, Header menu, Footer menu, Homepage hero/sections, FAQ
- Atribut va opsiyalar tarjimasi
- Telegram order template multilingual

---

## 5-bosqich — Blog tizimi

- `blog_posts` (id, slug, image, status, published_at, author_id)
- `blog_post_translations` (post_id, language_code, title, excerpt, content, seo_title, seo_description)
- Admin: `/admin/blog` — CRUD + til tablari
- Frontend: `/blog`, `/blog/:slug` (lang prefiks bilan)
- Sitemap'ga qo'shish

---

## Texnik tafsilotlar (1-bosqich)

**Yangi fayllar:**
- `supabase/migrations/...` — `languages` jadval + RLS + trigger
- `src/hooks/useLanguages.tsx` — DBdan tillar ro'yxati
- `src/pages/admin/Languages.tsx` yoki `SystemSettings.tsx` ichida til boshqaruv kartasi
- `src/components/admin/LanguageManager.tsx` — to'liq UI (qo'shish/edit/delete/drag/toggle)

**O'zgaradigan fayllar:**
- `src/hooks/useLanguage.tsx` — DBdan faol tillarni o'qiydi, bo'sh bo'lsa fallback
- `src/components/layout/Header.tsx` — til switcher dinamik
- `src/pages/admin/SystemSettings.tsx` — mavjud "Til sozlamalari" kartasini almashtirish

**Hozircha tegmaydigan narsalar:**
- Mahsulot/kategoriya/brend jadvallari
- Mavjud `_uz`/`_ru` columnlar
- Frontend kontent rendering
- Routing
- SEO/sitemap
- Blog (hali yo'q)

---

## Tasdiqlasangiz

Faqat **1-bosqich**ni boshlayman: `languages` jadvali + bo'sh admin paneli + dinamik switcher. Sayt UZ/RU bilan ishlashda davom etadi. Tilllarni o'zingiz qo'shasiz, keyin 2-bosqichga o'tamiz.
