import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWED_BUCKETS = new Set(['product-images', 'brand-images'])
const MAX_FILE_SIZE = 5 * 1024 * 1024

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Faqat POST so\'rovi qabul qilinadi' }, 405)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Sessiya topilmadi. Iltimos, qaytadan tizimga kiring.' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      return jsonResponse({ error: 'Sessiya yaroqsiz. Iltimos, qaytadan tizimga kiring.' }, 401)
    }

    const { data: roleRow, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (roleError || !['admin', 'editor', 'manager'].includes(roleRow?.role ?? '')) {
      console.error('[upload-site-image] permission denied', { userId: user.id, roleError, role: roleRow?.role })
      return jsonResponse({ error: 'Sizda rasm yuklash uchun ruxsat yo\'q.' }, 403)
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const bucket = String(formData.get('bucket') ?? 'product-images')
    const contentKey = String(formData.get('contentKey') ?? 'site-image')

    if (!(file instanceof File)) {
      return jsonResponse({ error: 'Rasm fayli yuborilmadi.' }, 400)
    }

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return jsonResponse({ error: 'Noto\'g\'ri rasm bo\'limi tanlandi.' }, 400)
    }

    if (!file.type.startsWith('image/')) {
      return jsonResponse({ error: 'Faqat rasm fayllari qabul qilinadi.' }, 400)
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ error: 'Rasm hajmi 5MB dan oshmasligi kerak.' }, 400)
    }

    const extensionFromName = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '')
    const extensionFromType = file.type.split('/')[1]?.replace('jpeg', 'jpg')
    const extension = extensionFromName || extensionFromType || 'jpg'
    const safeKey = contentKey.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 80) || 'site-image'
    const filePath = `site-content/${safeKey}-${Date.now()}.${extension}`

    console.info('[upload-site-image] upload started', {
      userId: user.id,
      role: roleRow?.role,
      bucket,
      filePath,
      fileSize: file.size,
      fileType: file.type,
    })

    const { error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[upload-site-image] upload failed', { uploadError, bucket, filePath })
      return jsonResponse({ error: `Rasmni yuklab bo'lmadi: ${uploadError.message}` }, 500)
    }

    const { data: { publicUrl } } = adminClient.storage.from(bucket).getPublicUrl(filePath)
    console.info('[upload-site-image] upload success', { bucket, filePath, publicUrl })

    return jsonResponse({ publicUrl, filePath, bucket })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Noma\'lum xatolik'
    console.error('[upload-site-image] unexpected error', error)
    return jsonResponse({ error: `Rasmni yuklashda xatolik: ${message}` }, 500)
  }
})