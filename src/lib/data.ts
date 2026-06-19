export interface Product {
  id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  fullDescription_uz: string;
  fullDescription_ru: string;
  price: number;
  originalPrice?: number;
  images: string[];
  categoryId: string;
  materials: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  active: boolean;
}

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  slug: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text_uz: string;
  text_ru: string;
  date: string;
  productId?: string;
}

export interface FAQ {
  id: string;
  question_uz: string;
  question_ru: string;
  answer_uz: string;
  answer_ru: string;
  category: 'ordering' | 'delivery' | 'warranty' | 'custom' | 'payment';
}

export const categories: Category[] = [
  {
    id: 'floor',
    name_uz: "Polga qo'yiladigan sushilkalar",
    name_ru: "Напольные сушилки",
    slug: 'floor',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
    productCount: 12,
  },
  {
    id: 'wall',
    name_uz: "Devorga osiladigan sushilkalar",
    name_ru: "Настенные сушилки",
    slug: 'wall',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
    productCount: 8,
  },
  {
    id: 'foldable',
    name_uz: "Bukiladigan sushilkalar",
    name_ru: "Складные сушилки",
    slug: 'foldable',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
    productCount: 15,
  },
  {
    id: 'balcony',
    name_uz: "Balkon uchun sushilkalar",
    name_ru: "Сушилки для балкона",
    slug: 'balcony',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
    productCount: 10,
  },
];

export const products: Product[] = [
  {
    id: '1',
    name_uz: "3 qavatli bukiladigan sushilka",
    name_ru: "Складная сушилка 3-ярусная",
    description_uz: "Keng sig'imli, mustahkam po'lat konstruksiya",
    description_ru: "Вместительная, прочная стальная конструкция",
    fullDescription_uz: "3 qavatli bukiladigan kiyim quritish stendi. Mustahkam po'lat ramka, zanglashga qarshi qoplama. 20 kg gacha yuk ko'taradi.",
    fullDescription_ru: "3-ярусный складной стенд для сушки белья. Прочная стальная рама с антикоррозийным покрытием. Выдерживает до 20 кг.",
    price: 250000,
    originalPrice: 350000,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    ],
    categoryId: 'foldable',
    materials: ["Po'lat", "Plastik"],
    sizes: ["170x60x105 sm"],
    colors: ["Kumush", "Oq"],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '2',
    name_uz: "Devorga osiladigan sushilka",
    name_ru: "Настенная сушилка",
    description_uz: "Joy tejamkor, devorga mahkamlanadi",
    description_ru: "Компактная, крепится к стене",
    fullDescription_uz: "Devorga mahkamlanadigan kiyim quritish stendi. Joy tejaydi, oson o'rnatiladi. 10 kg gacha yuk ko'taradi.",
    fullDescription_ru: "Настенная сушилка для белья. Экономит место, легко устанавливается. Выдерживает до 10 кг.",
    price: 180000,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    ],
    categoryId: 'wall',
    materials: ["Po'lat", "ABS plastik"],
    sizes: ["100x40 sm", "120x50 sm"],
    colors: ["Oq", "Kumush"],
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '3',
    name_uz: "Balkon sushilkasi",
    name_ru: "Сушилка для балкона",
    description_uz: "Balkon panjarasiga mahkamlanadi",
    description_ru: "Крепится на балконное ограждение",
    fullDescription_uz: "Balkonga maxsus sushilka. Panjara yoki devorga oson mahkamlanadi. Shamolda kiyim tez quriydi.",
    fullDescription_ru: "Специальная сушилка для балкона. Легко крепится к ограждению или стене. Бельё быстро сохнет на ветру.",
    price: 150000,
    originalPrice: 200000,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    ],
    categoryId: 'balcony',
    materials: ["Alyuminiy", "Plastik"],
    sizes: ["120x50 sm"],
    colors: ["Oq", "Kulrang"],
    rating: 4.6,
    reviewCount: 67,
    inStock: true,
    featured: true,
    active: true,
  },
  {
    id: '4',
    name_uz: "Polga qo'yiladigan katta sushilka",
    name_ru: "Большая напольная сушилка",
    description_uz: "Katta oilalar uchun ideal",
    description_ru: "Идеально для большой семьи",
    fullDescription_uz: "Katta o'lchamli polga qo'yiladigan sushilka. 25 kg gacha yuk ko'taradi. Mustahkam po'lat konstruksiya.",
    fullDescription_ru: "Большая напольная сушилка. Выдерживает до 25 кг. Прочная стальная конструкция.",
    price: 350000,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
    ],
    categoryId: 'floor',
    materials: ["Po'lat", "Plastik"],
    sizes: ["180x70x110 sm"],
    colors: ["Kumush", "Qora"],
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    featured: true,
    active: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    name: "Aziz Karimov",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 5,
    text_uz: "Juda ajoyib sifat! Sushilkamiz bir yildan beri mukammal holatda. Oilam juda mamnun. Rahmat!",
    text_ru: "Отличное качество! Наша сушилка в идеальном состоянии уже год. Семья очень довольна. Спасибо!",
    date: "2024-01-15",
  },
  {
    id: '2',
    name: "Dilnoza Rahimova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 5,
    text_uz: "3 qavatli sushilka oldim. Sifati va xizmati a'lo darajada. Hammaga tavsiya qilaman!",
    text_ru: "Купила 3-ярусную сушилку. Качество и сервис на высшем уровне. Рекомендую всем!",
    date: "2024-02-20",
  },
  {
    id: '3',
    name: "Sardor Aliyev",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    rating: 5,
    text_uz: "Tez yetkazib berish va sifatli mahsulot. Balkon sushilkasi juda qulay ekan.",
    text_ru: "Быстрая доставка и качественный товар. Балконная сушилка очень удобная.",
    date: "2024-03-10",
  },
  {
    id: '4',
    name: "Gulnora Usmanova",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    rating: 4,
    text_uz: "Devorga osiladigan sushilka oldim. Juda qulay va joy tejaydi. Tavsiya qilaman!",
    text_ru: "Купила настенную сушилку. Очень удобная и экономит место. Рекомендую!",
    date: "2024-03-25",
  },
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question_uz: "Buyurtma qanday beriladi?",
    question_ru: "Как оформить заказ?",
    answer_uz: "Saytdan mahsulotni tanlang, savatga qo'shing va checkout sahifasida ma'lumotlaringizni kiriting. Buyurtma Telegram orqali bizga keladi va biz tasdiqlash uchun siz bilan bog'lanamiz.",
    answer_ru: "Выберите товар на сайте, добавьте в корзину и заполните данные на странице оформления. Заказ поступит к нам через Telegram, и мы свяжемся с вами для подтверждения.",
    category: 'ordering',
  },
  {
    id: '2',
    question_uz: "Yetkazib berish qancha vaqt oladi?",
    question_ru: "Сколько времени занимает доставка?",
    answer_uz: "Toshkent bo'ylab 1-2 kun ichida, viloyatlarga 2-4 kun ichida yetkazib beriladi.",
    answer_ru: "По Ташкенту 1-2 дня, в регионы 2-4 дня.",
    category: 'delivery',
  },
  {
    id: '3',
    question_uz: "Mahsulotlar originalmi?",
    question_ru: "Товары оригинальные?",
    answer_uz: "Ha, faqat rasmiy distribyutorlardan ish olamiz. Royal Canin, Pro Plan, Hill's va boshqa brendlar — 100% original.",
    answer_ru: "Да, работаем только с официальными дистрибьюторами. Royal Canin, Pro Plan, Hill's и другие — 100% оригинал.",
    category: 'warranty',
  },
  {
    id: '4',
    question_uz: "Itim uchun qaysi ozuqani tanlashim kerak?",
    question_ru: "Какой корм выбрать для моей собаки?",
    answer_uz: "It yoshiga (puppy/adult/senior), zotiga va faollik darajasiga qarab tanlanadi. Kichik zotlar uchun Mini, katta zotlar uchun Maxi liniyalari mavjud. Aniq tavsiya uchun AI yordamchimiz yoki menejerimizga murojaat qiling.",
    answer_ru: "Корм подбирается по возрасту (puppy/adult/senior), породе и активности. Для мелких пород — линейка Mini, для крупных — Maxi. Для точной рекомендации обратитесь к AI-помощнику или менеджеру.",
    category: 'custom',
  },
  {
    id: '5',
    question_uz: "Mushugim sterilizatsiya qilingan, qanday ozuqa kerak?",
    question_ru: "Кошка стерилизована, какой корм нужен?",
    answer_uz: "Sterilizatsiya qilingan mushuklar uchun maxsus Sterilized liniyali ozuqalar mavjud (Royal Canin Sterilised, Pro Plan Sterilised, Hill's Sterilised). Bu ozuqalar vazn nazorati va siydik tizimini sog'lom saqlash uchun mo'ljallangan.",
    answer_ru: "Для стерилизованных кошек есть специальные линейки Sterilized (Royal Canin Sterilised, Pro Plan Sterilised, Hill's Sterilised). Они контролируют вес и поддерживают здоровье мочевыделительной системы.",
    category: 'custom',
  },
  {
    id: '6',
    question_uz: "Quruq va nam ozuqaning farqi nima?",
    question_ru: "В чём разница между сухим и влажным кормом?",
    answer_uz: "Quruq ozuqa uzoq saqlanadi, tishlarni tozalaydi, arzonroq. Nam ozuqada ko'p suv bo'ladi (suv kam ichadigan mushuklar uchun foydali), ko'proq mazali. Ko'pincha aralash beriladi.",
    answer_ru: "Сухой корм дольше хранится, очищает зубы, дешевле. Влажный содержит много воды (полезен кошкам, мало пьющим), вкуснее. Часто их комбинируют.",
    category: 'custom',
  },
  {
    id: '7',
    question_uz: "Veterinar ozuqalar retsept bilan beriladimi?",
    question_ru: "Ветеринарные корма отпускаются по рецепту?",
    answer_uz: "Davolovchi diyetalar (Hill's Prescription Diet, Royal Canin Veterinary) veterinar tavsiyasi asosida tanlanishi tavsiya etiladi. Aniq tashxis uchun veterinarga murojaat qiling.",
    answer_ru: "Лечебные диеты (Hill's Prescription Diet, Royal Canin Veterinary) рекомендуется подбирать по назначению ветеринара. Для точного диагноза обратитесь к ветеринару.",
    category: 'warranty',
  },
  {
    id: '8',
    question_uz: "To'lov qanday amalga oshiriladi?",
    question_ru: "Как производится оплата?",
    answer_uz: "Naqd pul (kuryerga), bank kartasi orqali (Click, Payme, Uzcard, Humo) yoki kelishilgan holda. To'lov turini checkout sahifasida tanlaysiz.",
    answer_ru: "Наличными (курьеру), банковской картой (Click, Payme, Uzcard, Humo) или по договорённости. Тип оплаты выбираете при оформлении.",
    category: 'payment',
  },
];

export const materials = [
  { id: 'steel', name_uz: "Po'lat", name_ru: "Сталь" },
  { id: 'aluminum', name_uz: "Alyuminiy", name_ru: "Алюминий" },
  { id: 'plastic', name_uz: "Plastik", name_ru: "Пластик" },
  { id: 'abs', name_uz: "ABS plastik", name_ru: "ABS пластик" },
];
