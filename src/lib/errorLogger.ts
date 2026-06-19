import { supabase } from '@/integrations/supabase/client';

/**
 * Log an error to console + admin_error_logs table.
 * Returns a user-friendly Uzbek message based on the error.
 */
export async function logAdminError(
  context: string,
  error: any,
  extra?: Record<string, any>
): Promise<string> {
  const message =
    error?.message || error?.error_description || error?.toString?.() || 'Noma\'lum xatolik';
  const statusCode = error?.statusCode || error?.status;

  const details = {
    statusCode,
    name: error?.name,
    stack: error?.stack,
    raw: typeof error === 'object' ? { ...error } : String(error),
    extra,
    url: typeof window !== 'undefined' ? window.location.href : null,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    timestamp: new Date().toISOString(),
  };

  // Verbose console log
  console.error(`[${context}]`, message, details);

  // Try to persist to admin_error_logs
  try {
    const { data: { user } } = await supabase.auth.getUser();
    let role: string | null = null;
    if (user) {
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      role = roleRow?.role ?? null;
    }

    await supabase.from('admin_error_logs').insert({
      user_id: user?.id ?? null,
      context,
      message: String(message).slice(0, 500),
      details: details as any,
      user_role: role,
    });
  } catch (logErr) {
    console.warn('Failed to persist admin error log:', logErr);
  }

  // Friendly message
  return mapFriendlyMessage(context, message, statusCode);
}

function mapFriendlyMessage(context: string, message: string, statusCode?: number | string): string {
  const msg = (message || '').toLowerCase();

  if (msg.includes('row-level security') || statusCode === '403' || statusCode === 403) {
    return 'Sizda bu amalni bajarish uchun ruxsat yo\'q. Iltimos, admin bilan bog\'laning.';
  }
  if (msg.includes('jwt') || msg.includes('auth') || statusCode === 401) {
    return 'Sessiya tugagan. Iltimos, qaytadan tizimga kiring.';
  }
  if (msg.includes('payload too large') || msg.includes('size')) {
    return 'Fayl hajmi juda katta.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Internet ulanishida muammo. Iltimos, qaytadan urinib ko\'ring.';
  }
  if (context.includes('upload')) {
    return `Rasmni yuklab bo'lmadi: ${message}`;
  }
  return message || 'Kutilmagan xatolik yuz berdi.';
}
