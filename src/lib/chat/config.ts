// Chat widget configuration
// PETFOOD MARKET — AI pet-food konsultant (it va mushuk ozuqalari)

export const CHAT_CONFIG = {
  API_BASE_URL: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`,
  TIMEOUT_MS: 20000,
  MAX_MESSAGE_LENGTH: 1000,
  STORAGE_KEY: "pm-chat-history-v1",
  CONVERSATION_ID_KEY: "pm-chat-conversation-id",
  BRAND_COLOR: "#6B3E26",
};

export const WELCOME_MESSAGES: Record<"uz" | "ru", string> = {
  uz: "Assalomu alaykum! Men PETFOOD MARKET AI konsultantiman. It va mushuklar uchun ozuqa tanlashda yordam beraman. 🐶🐱",
  ru: "Здравствуйте! Я AI-консультант PETFOOD MARKET. Помогу подобрать корм для вашей собаки или кошки. 🐶🐱",
};

export const SUGGESTED_QUESTIONS: Record<"uz" | "ru", string[]> = {
  uz: [
    "Itim uchun ozuqa tanlang",
    "Mushugim uchun ozuqa tanlang",
    "Quruq va nam ozuqa farqi",
    "Sterilized mushuklar uchun",
    "Royal Canin haqida",
    "Yetkazib berish shartlari",
  ],
  ru: [
    "Подобрать корм для собаки",
    "Подобрать корм для кошки",
    "Сухой или влажный корм",
    "Корм для стерилизованных",
    "О Royal Canin",
    "Условия доставки",
  ],
};

export const UI_TEXT: Record<"uz" | "ru", Record<string, string>> = {
  uz: {
    title: "PETFOOD MARKET AI",
    online: "Onlayn",
    placeholder: "It yoki mushuk ozuqasi haqida so'rang...",
    send: "Yuborish",
    clear: "Suhbatni tozalash",
    error: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
    retry: "Qayta urinish",
    typing: "Yozmoqda",
    suggested: "Tez savollar",
    close: "Yopish",
    open: "Chatni ochish",
  },
  ru: {
    title: "PETFOOD MARKET AI",
    online: "Онлайн",
    placeholder: "Спросите о корме для собак или кошек...",
    send: "Отправить",
    clear: "Очистить чат",
    error: "Произошла ошибка. Пожалуйста, попробуйте снова.",
    retry: "Повторить",
    typing: "Печатает",
    suggested: "Быстрые вопросы",
    close: "Закрыть",
    open: "Открыть чат",
  },
};
