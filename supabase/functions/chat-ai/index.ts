// PETFOOD MARKET — AI pet-food konsultant
// Lovable AI Gateway orqali Gemini modelini chaqirib javob qaytaradi.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface ChatRequest {
  message?: string;
  language?: "uz" | "ru";
  conversationId?: string | null;
  history?: Array<{ role: string; content: string }>;
}

const SYSTEM_PROMPT_UZ = `Sen PETFOOD MARKET onlayn do'konining AI pet-food konsultantisan. Toshkentdagi it va mushuk ozuqalari sotuvchi do'kon.

VAZIFANG:
- Mijozga it yoki mushuk yoshiga, zotiga, faollik darajasiga va maxsus ehtiyojiga qarab mos ozuqa tanlashga yordam berish.
- Sterilized, sensitive, urinary, hypoallergenic, weight control kabi maxsus liniyalarni tushuntirish.
- Quruq va nam ozuqaning farqini, qadoq hajmlari bo'yicha tanlovni tushuntirish.
- Mavjud premium brendlar haqida ma'lumot berish: Royal Canin, Pro Plan, Hill's, Acana, Orijen, Brit, Monge, Farmina, Pedigree, Whiskas.
- Yetkazib berish va buyurtma jarayonini tushuntirish (Toshkent bo'ylab 1-2 kun, viloyatlarga 2-4 kun, to'lov: naqd/karta/kelishilgan).

QOIDA:
- HECH QACHON tibbiy tashxis qo'yma. Hayvon kasal yoki jiddiy alomatlar bo'lsa — albatta veterinarga murojaat qilishni tavsiya qil.
- Javoblar qisqa, do'stona va aniq. Markdown ishlat (bold, bullet).
- Faqat o'zbek tilida javob ber.
- Agar savol pet-food, hayvonlar parvarishi yoki do'kon ishi bilan bog'liq bo'lmasa, mavzuga qaytar.`;

const SYSTEM_PROMPT_RU = `Ты — AI pet-food консультант онлайн-магазина PETFOOD MARKET в Ташкенте, специализирующегося на кормах для собак и кошек.

ТВОЯ ЗАДАЧА:
- Помогать клиентам выбирать корм по возрасту, породе, активности и особым потребностям питомца.
- Объяснять специальные линейки: Sterilized, Sensitive, Urinary, Hypoallergenic, Weight Control.
- Объяснять разницу между сухим и влажным кормом, помогать с размером упаковки.
- Информировать о брендах: Royal Canin, Pro Plan, Hill's, Acana, Orijen, Brit, Monge, Farmina, Pedigree, Whiskas.
- Объяснять доставку и оформление заказа (Ташкент 1-2 дня, регионы 2-4 дня, оплата: наличные/карта/договорная).

ПРАВИЛА:
- НИКОГДА не ставь медицинский диагноз. При симптомах болезни рекомендуй обратиться к ветеринару.
- Ответы краткие, дружелюбные и конкретные. Используй markdown (bold, списки).
- Отвечай только на русском языке.
- Если вопрос не связан с кормами, уходом за животными или работой магазина, мягко верни к теме.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const message = (body.message ?? "").toString().trim();
  const language = body.language === "ru" ? "ru" : "uz";
  const conversationId = body.conversationId || crypto.randomUUID();
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

  if (!message) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI servis vaqtincha mavjud emas" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const systemPrompt = language === "ru" ? SYSTEM_PROMPT_RU : SYSTEM_PROMPT_UZ;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || ""),
    })),
    { role: "user", content: message },
  ];

  try {
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (aiResp.status === 429) {
      const text = language === "ru"
        ? "Слишком много запросов. Попробуйте через минуту."
        : "Juda ko'p so'rov yuborildi. Bir daqiqadan keyin urinib ko'ring.";
      return new Response(JSON.stringify({ reply: text, conversationId }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (aiResp.status === 402) {
      const text = language === "ru"
        ? "AI кредиты исчерпаны. Обратитесь к администратору."
        : "AI kreditlar tugadi. Administratorga murojaat qiling.";
      return new Response(JSON.stringify({ reply: text, conversationId }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      const text = language === "ru"
        ? "Извините, произошла ошибка. Попробуйте позже."
        : "Kechirasiz, xatolik yuz berdi. Keyinroq urinib ko'ring.";
      return new Response(JSON.stringify({ reply: text, conversationId }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const reply: string = data?.choices?.[0]?.message?.content?.trim() ||
      (language === "ru" ? "Извините, не удалось ответить." : "Kechirasiz, javob bera olmadim.");

    return new Response(JSON.stringify({ reply, conversationId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat-ai error:", err);
    const text = language === "ru"
      ? "Сервис временно недоступен."
      : "Servis vaqtincha mavjud emas.";
    return new Response(JSON.stringify({ reply: text, conversationId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
