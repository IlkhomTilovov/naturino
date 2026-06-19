import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramRequest {
  type: 'test' | 'order';
  order_data?: {
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_message?: string;
    total_price: number;
    pet_type?: string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_type?: string;
    payment_type?: string;
    recurrence?: string;
    items: Array<{
      product_name: string;
      quantity: number;
      price: number;
      selected_options?: {
        size?: string;
        color?: string;
        package_size?: string;
      };
    }>;
  };
}

async function getTelegramSettings(supabase: any) {
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['telegram_bot_token', 'telegram_chat_id', 'telegram_enabled']);

  if (error) {
    console.error('Error fetching telegram settings:', error);
    throw new Error('Telegram sozlamalarini yuklashda xatolik');
  }

  const settings: Record<string, string> = {};
  data?.forEach((item: any) => {
    settings[item.key] = item.value || '';
  });

  return {
    bot_token: settings['telegram_bot_token'] || '',
    chat_id: settings['telegram_chat_id'] || '',
    enabled: settings['telegram_enabled'] === 'true',
  };
}

async function sendTelegramMessage(botToken: string, chatId: string, message: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });

  const result = await response.json();
  
  if (!result.ok) {
    console.error('Telegram API error:', result);
    throw new Error(result.description || 'Telegram xabar yuborishda xatolik');
  }

  return result;
}

function formatOrderMessage(orderData: TelegramRequest['order_data']) {
  if (!orderData) return '';

  const petTypeLabel: Record<string, string> = { dog: '🐕 It', cat: '🐈 Mushuk', both: '🐕🐈 Ikkalasi' };
  const deliveryLabel: Record<string, string> = { courier: '🚚 Kuryer', pickup: '🏪 Olib ketish' };
  const paymentLabel: Record<string, string> = { cash: '💵 Naqd', card: '💳 Karta', negotiable: '🤝 Kelishilgan' };
  const recurrenceLabel: Record<string, string> = { once: 'Bir martalik', biweekly: 'Har 2 hafta', monthly: 'Har oy' };

  const itemsList = orderData.items.map(item => {
    let line = `• ${item.product_name} x${item.quantity}`;
    const opts: string[] = [];
    if (item.selected_options?.package_size) opts.push(`Qadoq: ${item.selected_options.package_size}`);
    if (item.selected_options?.size) opts.push(`O'lcham: ${item.selected_options.size}`);
    if (item.selected_options?.color) opts.push(`Ta'm/Rang: ${item.selected_options.color}`);
    if (opts.length) line += ` (${opts.join(', ')})`;
    line += ` — ${new Intl.NumberFormat('uz-UZ').format(item.price * item.quantity)} so'm`;
    return line;
  }).join('\n');

  const lines = [
    '🐾 *Yangi buyurtma — PETFOOD MARKET*',
    '',
    `📋 *Buyurtma:* ${orderData.order_number}`,
    `👤 *Mijoz:* ${orderData.customer_name}`,
    `📞 *Telefon:* ${orderData.customer_phone}`,
  ];
  if (orderData.pet_type) lines.push(`🐕 *Hayvon:* ${petTypeLabel[orderData.pet_type] || orderData.pet_type}`);
  if (orderData.delivery_city) lines.push(`📍 *Shahar/Hudud:* ${orderData.delivery_city}`);
  if (orderData.delivery_address) lines.push(`🏠 *Manzil:* ${orderData.delivery_address}`);
  if (orderData.delivery_type) lines.push(`🚚 *Yetkazib berish:* ${deliveryLabel[orderData.delivery_type] || orderData.delivery_type}`);
  if (orderData.payment_type) lines.push(`💳 *To'lov:* ${paymentLabel[orderData.payment_type] || orderData.payment_type}`);
  if (orderData.recurrence && orderData.recurrence !== 'once') lines.push(`🔁 *Takror:* ${recurrenceLabel[orderData.recurrence] || orderData.recurrence}`);
  lines.push('', '*Mahsulotlar:*', itemsList, '', `💰 *Jami:* ${new Intl.NumberFormat('uz-UZ').format(orderData.total_price)} so'm`);
  if (orderData.customer_message) lines.push('', `💬 *Izoh:* ${orderData.customer_message}`);

  return lines.join('\n');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: TelegramRequest = await req.json();
    console.log('Telegram request type:', body.type);

    // Get Telegram settings from database
    const settings = await getTelegramSettings(supabase);
    console.log('Telegram enabled:', settings.enabled);

    // Validate settings
    if (!settings.bot_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot token sozlanmagan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate bot token format (basic check)
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(settings.bot_token)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot token formati noto\'g\'ri' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!settings.chat_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Chat ID sozlanmagan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For order notifications, check if enabled
    if (body.type === 'order' && !settings.enabled) {
      console.log('Telegram notifications disabled, skipping order notification');
      return new Response(
        JSON.stringify({ success: true, skipped: true, message: 'Telegram xabarlari o\'chirilgan' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let message: string;

    if (body.type === 'test') {
      // Check if enabled for test messages too
      if (!settings.enabled) {
        return new Response(
          JSON.stringify({ success: false, error: 'Telegram xabarlari yoqilmagan. Avval "Telegram xabarlarini yoqish" tugmasini yoqing.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      message = '✅ *Test xabar*\n\n🐾 PETFOOD MARKET admin paneli bilan aloqa muvaffaqiyatli o\'rnatildi!\n\nBuyurtmalar haqida xabarlar shu chatga keladi.';
    } else if (body.type === 'order') {
      if (!body.order_data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Buyurtma ma\'lumotlari yo\'q' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      message = formatOrderMessage(body.order_data);
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Noto\'g\'ri so\'rov turi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send the message
    await sendTelegramMessage(settings.bot_token, settings.chat_id, message);
    console.log('Telegram message sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Xabar yuborildi' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Telegram error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Xatolik yuz berdi' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
