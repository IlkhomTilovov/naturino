# PETFOOD MARKET — Loyihani pet-food yo'nalishiga moslashtirish

Mavjud texnik arxitektura (React + Supabase + admin panel + CMS + dinamik atributlar + Telegram + SEO + UZ/RU) **to'liq saqlanadi**. Faqat kontent, kategoriyalar, atributlar, biznes logika va dizayn aksenti pet-food yo'nalishiga moslashadi.

Ish hajmi katta bo'lgani uchun **5 ta bosqichga** ajratiladi. Har bir bosqich o'zicha ishlaydigan, sinab ko'rsa bo'ladigan natija beradi.

---

## Bosqich 1 — Brending va kontent migratsiyasi

**Maqsad:** "MIR MEXA / mo'yna" izlarini olib tashlash, "PETFOOD MARKET" pozitsiyasini joriy qilish.

- `system_settings` da brand_name, logo matni, footer, contact ma'lumotlari → PETFOOD MARKET
- `site_content` (CMS) yozuvlarini UZ/RU pet-food matnlari bilan yangilash:
  - Hero: "It va mushuklar uchun sifatli ozuqalar"
  - Afzalliklar bloki (tez yetkazib berish, original, veterinar tavsiya, qulay buyurtma)
  - About, Contact, Footer matnlari
- `index.html` — sitewide title, description, OG:title PETFOOD MARKETga
- FAQ sahifasi yangi 8 ta savol bilan to'ldiriladi (insert orqali)
- Header/Footer/Navigation matnlari `translations.ts` da yangilanadi

## Bosqich 2 — Kategoriyalar va brendlar

**Maqsad:** Eski kiyim kategoriyalarini olib tashlab, 16 ta pet-food kategoriya yaratish.

- Eski `categories` yozuvlari deaktivatsiya
- 16 ta yangi kategoriya (Itlar uchun ozuqa, Mushuklar uchun ozuqa, Quruq, Nam, Veterinary, Puppy, Kitten, Adult, Senior, Sterilized, Sensitive, Urinary, Hypoallergenic, Premium, Treats, Aksessuarlar) — har birida slug, UZ/RU nom + tavsif, SEO title/description
- Premium pet-food brendlar (Royal Canin, Pro Plan, Hill's, Acana, Orijen, Brit, Monge, Farmina, Pedigree, Whiskas) `brands` jadvaliga insert
- Hero ostida **tezkor filtr tugmalari:** "Itlar uchun" / "Mushuklar uchun"

## Bosqich 3 — Dinamik atributlar tizimi

**Maqsad:** Mavjud `attributes` + `attribute_options` jadvallariga pet-food atributlarini joylash.

Atribut guruhlari va opsiyalar:
- Hayvon turi (it/mushuk) — **filter**
- Yosh guruhi (puppy/kitten/adult/senior) — **filter**
- Ozuqa turi (dry/wet/treat/veterinary/premium) — **filter**
- Qadoq hajmi (400g…15kg) — **filter** + variant uchun
- Ta'm (tovuq/mol/baliq/qo'y/kurka/losos/o'rdak) — **filter**
- Maxsus ehtiyoj (sterilized/sensitive/urinary/hypoallergenic/hairball/weight/digestive/skin&coat) — **filter**
- Kelib chiqish mamlakati — **filter**
- Veterinar tavsiyasi (ha/yo'q) — **filter** + badge
- Tarkib atributlari (protein %, yog' %, kletchatka %, namlik %, vitaminlar, mineral, asosiy ingredient, allergensiz, grain-free)

`CatalogFilterSidebar` shu atributlarni avtomatik o'qib filtrlarni chiqaradi (mavjud arxitektura buni qo'llab-quvvatlaydi).

## Bosqich 4 — Mahsulot/Checkout/Telegram biznes logikasi

**Maqsad:** Pet-food spetsifik logika qo'shish.

- **Ombor qoldig'i:** `products.stock_quantity` ishlatiladi; 0 bo'lsa "Tugagan" badge + savatga qo'shish bloklanadi
- **Qadoq variantlari:** har bir variant alohida product yoki product_attribute_values orqali — narx + qoldiq alohida
- **Veterinar tavsiyasi badge** ProductCard va ProductDetails da
- **Takroriy buyurtma:** checkoutda "Har 2 hafta / Har oy / Bir martalik" tanlovi (`orders` ga `recurrence` kolonkasi qo'shiladi)
- **Yetkazib berish zonalari:** yangi `delivery_zones` jadvali (Toshkent shaharlari/viloyatlar + narx), admin paneldan boshqariladi
- **Checkout maydonlari** `checkout_fields` orqali yangilanadi: Ism, Telefon, Manzil, Shahar/Tuman (zone select), Hayvon turi, Izoh, To'lov turi, Yetkazib berish turi
- **Telegram xabar formati** (`send-telegram` edge function) yangilanadi — buyurtma raqami, mijoz, manzil, mahsulotlar (qadoq+soni), summa, yetkazib berish turi, to'lov turi
- ProductDetails sahifasi pet-food maydonlari (tarkib, porsiya jadvali, saqlash sharoiti, maxsus ehtiyoj mosligi) bilan kengaytiriladi

## Bosqich 5 — SEO, AI chat, bosh sahifa qayta tartibi

- **SEO kalit so'zlar** (it ozuqasi Toshkent, Royal Canin Uzbekistan, sterilized mushuk ozuqasi va h.k.) `useSEO` fallbacklariga va kategoriya meta'lariga joylanadi
- JSON-LD Product schema mavjud — pet-food maydonlari qo'shiladi (brand, category)
- Sitemap avtomatik (mavjud `generate-sitemap` ishlaydi) — yangi kategoriyalar o'z-o'zidan tushadi
- **Bosh sahifa bloklari:** Hero → Tezkor tanlov (It/Mushuk) → Mashhur brendlar → Premium → Veterinar tavsiya etadi → Chegirmadagi → Yangi kelgan → Quruq → Nam → Afzalliklar
- **AI chat (`chat-ai` edge function)** system prompti pet-food konsultantga moslashtiriladi (yosh/maxsus ehtiyoj bo'yicha tavsiya + tibbiy tashxis qo'ymaslik + veterinarga yo'naltirish)
- Dizayn aksentlari: iliq ranglar saqlanadi, hayvon ikonlari (lucide-react `Dog`, `Cat`, `PawPrint`), mahsulot kartasida qadoq hajmi + hayvon turi badge

---

## Texnik tafsilotlar

**Database o'zgarishlar (migration):**
- `orders` ga `delivery_zone_id`, `delivery_type`, `payment_type`, `recurrence`, `pet_type` kolonkalari
- Yangi `delivery_zones(id, name_uz, name_ru, price, is_active, sort_order)` + RLS + GRANT
- `products.stock_quantity` mavjud bo'lsa ishlatiladi, yo'q bo'lsa qo'shiladi

**Data inserts (migration emas, insert tool):**
- Yangi categories, brands, attributes + options, checkout_fields, delivery_zones, FAQ entries, site_content yangilash

**Kod o'zgarishlar:**
- `index.html`, `translations.ts`, `useSEO.tsx` — brending/SEO
- `OrderForm.tsx`, `Checkout.tsx` — yangi maydonlar
- `send-telegram/index.ts` — xabar formati
- `chat-ai/index.ts` — yangi system prompt
- `Index.tsx` (bosh sahifa) — yangi bloklar tartibi
- `ProductCard.tsx`, `ProductDetails.tsx` — qadoq/hayvon turi/veterinar badge
- `CatalogFilterSidebar.tsx` — tezkor filtr tugmalari

**Saqlanadi (o'zgarmaydi):**
React/TS frontend stack, Supabase auth/RLS, admin panel routelari, CMS, dinamik atributlar engine, savat tizimi, analitika, themes, UZ/RU til engine, sitemap, JSON-LD, image storage.

---

## Tavsiya: tasdiqlangandan keyin **Bosqich 1 + 2 + 3** birinchi iteratsiyada bajarish (kontent + tuzilma), keyin **Bosqich 4 + 5** ikkinchi iteratsiyada (biznes logika + AI/SEO). Shunday qilsak har bosqichni alohida ko'rib chiqsangiz bo'ladi.

Tasdiqlasangiz, **Bosqich 1 dan boshlayman.**
