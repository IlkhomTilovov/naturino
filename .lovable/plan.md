# Naturino 2.0 — Ekspert Pet-Food Ekotizimi

Bu juda katta ko'lamli loyiha. Uni **6 bosqichga** ajratamiz. Har bir bosqich alohida ishlaydigan, sinab ko'rsa bo'ladigan natija beradi. Tasdiqlasangiz, **Bosqich 1 dan ketma-ket** boshlayman.

Hozir mavjud poydevor (React+TS, Supabase backend, admin panel, CMS, dinamik atributlar, savat, checkout, Telegram, SEO, UZ/RU) **to'liq saqlanadi**, faqat ustiga yangi modullar quriladi.

---

## Bosqich 1 — Brendlar va Mahsulot Liniyalari (ekspert kontent)

**Maqsad:** brend sahifasini "logo + tavsif"dan "brend pasporti"ga aylantirish.

- `brands` jadvaliga yangi maydonlar: `country`, `manufacturer`, `founded_year`, `segment` (premium/superpremium/holistic), `for_whom_uz/ru`, `advantages_uz/ru` (jsonb), `key_ingredients_uz/ru`, `vet_recommendation_uz/ru`, `naturino_note_uz/ru`, `history_uz/ru`
- Yangi jadval **`product_lines`** (Royal Canin Sterilised, Pro Plan Sensitive, Monge Vet Solution, Farmina N&D va h.k.): brend bog'lanishi, slug, kim uchun, qanday muammo, tarkib, afzalliklar, yosh, qarshi ko'rsatmalar, banner
- `products` ga `product_line_id` FK
- Yangi sahifalar: `/brand/:slug` (kengaytirilgan dizayn — tarix, segment badge, afzalliklar grid, vet tavsiyasi, Naturino tavsiyasi, liniyalar carousel) va `/liniya/:slug` (liniya landingi — mos mahsulotlar bilan)
- Admin panelda **Brands** va yangi **Product Lines** sahifalari (CMS uslubida tahrir)

## Bosqich 2 — Sifat Kafolati bo'limi

**Maqsad:** ishonch hosil qilish.

- Yangi jadval **`trust_documents`**: turi (sertifikat/import/sklad), title_uz/ru, description, file_url (PDF/image), media_type, sort_order
- Storage bucket `trust-documents` (public read)
- Sahifa `/sifat-kafolati` — bo'limlar: Original mahsulotlar, Rasmiy distributorlar, Sertifikatlar (PDF preview grid), Import hujjatlari, Saqlash standartlari, Ombor sharoitlari (video/rasm galereya)
- Header menyusiga "Sifat kafolati" qo'shiladi
- Admin sahifa: PDF/rasm/video yuklash, kategoriya tanlash, sortlash

## Bosqich 3 — Pet Nutrition Center + Blog + Chuqur FAQ

**Maqsad:** SEO trafik va ekspert maqomi.

- Sahifa `/nutrition-center` — interaktiv tanlov: hayvon turi (it/mushuk) → yosh (puppy/kitten/adult/senior) → maxsus ehtiyoj. Natijada mos mahsulotlar + tavsiya matni
- Tipik savollar bloki ("Mushugim sterilized…", "Allergiyasi bo'lsa…") — har biri AI chatga seed sifatida o'tadi
- AI chat (`chat-ai` edge func) system prompti ushbu markaz ma'lumotlaridan foydalanadigan tarzda yangilanadi
- Yangi jadval **`blog_posts`**: slug, title_uz/ru, excerpt_uz/ru, content_uz/ru (markdown), cover_image, category (oziqlantirish/vet/brendlar), reading_time, published_at, author, SEO meta'lar
- Sahifalar `/blog` (kategoriya filtrli list) va `/blog/:slug` (article — JSON-LD Article schema, related posts)
- Boshlanishiga 20 ta tayyor maqola insert qilinadi (UZ asosiy, RU tarjima)
- FAQ kengaytiriladi: kategoriyalar (Oziqlantirish, Veterinar, Yetkazib berish, To'lov, Sifat) va 30+ savol qo'shiladi; JSON-LD FAQPage schema

## Bosqich 4 — Naturino Club (loyalty) + Takroriy buyurtma

**Maqsad:** mijozni qaytarish.

- Yangi jadvallar: **`loyalty_accounts`** (user_id, balance, tier silver/gold/platinum, total_spent), **`loyalty_transactions`** (earn/spend, order_id, points, reason), **`subscriptions`** (user_id, product_id, frequency, next_delivery_at, status, address)
- Qoidalar: 100 000 so'm = 1 ball, 100 ball = 10 000 so'm chegirma. Tier — yillik xaridga qarab
- Checkoutda "Ball ishlatish" toggle + tier ko'rinishi
- ProductDetails da "Takroriy buyurtma" tanlovi (har 2 hafta / oy / 2 oy)
- Sahifa `/club` — balans, tarix, tier afzalliklari, faol obunalar
- Admin: Loyalty va Subscriptions paneli + avtomatik eslatma (pg_cron + edge func → Telegram bildirish admin va mijozga)

## Bosqich 5 — Veterinar bo'limi + Shahar/Yetkazib berish

**Maqsad:** ekspert kontent + logistika.

- Sahifa `/veterinar` — ekspert maqolalar (blog'dan `category=vet` filtrli), video maslahatlar (`vet_videos` jadvali: youtube_id, title, doctor_name), tavsiya etilgan mahsulotlar
- Veterinar tavsiya badge ProductCardda mavjud — endi `vet_recommendation_text` bilan kengaytiriladi
- `delivery_zones` mavjud — yangi 6 ta shahar (Toshkent, Samarqand, Buxoro, Andijon, Namangan, Farg'ona) narx/muddat bilan to'ldiriladi
- Header'da shahar tanlash dropdown (localStorage) — narx va muddat avtomatik moslashadi
- Catalog/Product sahifalarida tanlangan shahar uchun mavjudlik va yetkazish muddati ko'rinadi

## Bosqich 6 — Bosh sahifa qayta tartibi + Instagram/Mijoz fikrlari

**Maqsad:** yangi modullarni bosh sahifada birlashtirish.

- Hero → Tezkor tanlov (It/Mushuk) → Premium brendlar carousel → **Veterinar tavsiya qiladi** bloki → Mashhur mahsulotlar → **Sifat kafolati** trust strip → **Blog** uchta yangi maqola → FAQ accordion → **Naturino Club** CTA → **Mijozlar fikrlari** (`testimonials` jadvali — admin tahrirlaydi) → **Instagram** bloki (`@username` orqali oxirgi 6 post, instagram embed) → **Yetkazib berish xaritasi** (6 shahar interaktiv)
- Yangi jadval **`testimonials`**: mijoz nomi, hayvon turi, matn, rating, avatar
- SEO: `index.html`, `useSEO` kalit so'zlari yangilanadi ("it ozuqasi Toshkent", "Royal Canin O'zbekiston", "sterilized mushuk ozuqasi", brend+shahar kombinatsiyalari)
- Sitemap avtomatik yangilanadi (blog + brand + liniya + shahar marshrutlari)

---

## Texnik xulosa

**Yangi jadvallar:** `product_lines`, `trust_documents`, `blog_posts`, `loyalty_accounts`, `loyalty_transactions`, `subscriptions`, `vet_videos`, `testimonials` (+ `brands` va `products` ga kolonkalar)

**Yangi storage:** `trust-documents`, `blog-images`

**Yangi edge functions:** `loyalty-earn` (order webhookida), `subscription-reminder` (pg_cron)

**Yangi sahifalar:** `/brand/:slug` (kengaytirilgan), `/liniya/:slug`, `/sifat-kafolati`, `/nutrition-center`, `/blog`, `/blog/:slug`, `/veterinar`, `/club`

**Saqlanadi:** mavjud arxitektura, admin panel, CMS, dinamik atributlar, savat, checkout, Telegram, themes, UZ/RU, sitemap, JSON-LD.

---

## Tavsiya

Reja katta — ketma-ket 6 bosqich. Har bosqich tugagach to'xtab natijani ko'rsataman, keyin keyingisiga o'taman.

**Tasdiqlasangiz, Bosqich 1 (Brendlar + Mahsulot liniyalari) dan boshlayman.**

Yoki agar boshqacha tartib (masalan, avval Blog+SEO, keyin loyalty) xohlasangiz ayting.
