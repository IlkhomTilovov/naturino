import { supabase } from '@/integrations/supabase/client';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024;

/** Uploads an image to the given public storage bucket and returns its public URL. Throws with a user-facing message on failure. */
export async function uploadMedia(file: File, bucket: string, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Faqat rasm formatlari ruxsat etiladi (JPG, PNG, WEBP, GIF, SVG)');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Rasm hajmi 10MB dan oshmasligi kerak');
  }
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
