import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useLanguages } from '@/hooks/useLanguages';

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero (Bosh blok)' },
  { value: 'stats', label: 'Statistika' },
  { value: 'feature_cards', label: 'Xususiyatlar kartalari' },
  { value: 'text_image', label: 'Matn + Rasm' },
  { value: 'product_showcase', label: 'Mahsulotlar vitrinasi' },
  { value: 'timeline', label: 'Vaqt chizig\'i' },
  { value: 'faq', label: 'Savol-Javob' },
  { value: 'cta', label: 'Chaqiriq (CTA)' },
];

interface Page {
  id: string;
  slug: string;
  page_type: string;
  is_active: boolean;
  is_system: boolean;
  show_in_menu: boolean;
  sort_order: number;
}

interface PageTranslation {
  id?: string;
  page_id: string;
  language_code: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
}

interface SectionTranslation {
  id?: string;
  section_id: string;
  language_code: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  cta_text: string | null;
  cta_url: string | null;
  image_alt: string | null;
}

interface Section {
  id: string;
  page_id: string;
  section_type: string;
  sort_order: number;
  is_active: boolean;
  settings: any;
  page_section_translations: SectionTranslation[];
}

export default function CmsPageEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeLanguages, defaultLanguage, loading: langLoading } = useLanguages();
  const [page, setPage] = useState<Page | null>(null);
  const [translations, setTranslations] = useState<Record<string, PageTranslation>>({});
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<string>('');

  useEffect(() => {
    if (defaultLanguage && !activeLang) setActiveLang(defaultLanguage.code);
  }, [defaultLanguage, activeLang]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: p }, { data: pt }, { data: secs }] = await Promise.all([
      supabase.from('pages').select('*').eq('id', id).single(),
      supabase.from('page_translations').select('*').eq('page_id', id),
      supabase.from('page_sections').select('*, page_section_translations(*)').eq('page_id', id).order('sort_order'),
    ]);
    if (p) setPage(p as any);
    if (pt) {
      const map: Record<string, PageTranslation> = {};
      (pt as any[]).forEach((t) => { map[t.language_code] = t; });
      setTranslations(map);
    }
    if (secs) setSections(secs as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  // Ensure a translation row exists for each active language in local state
  useEffect(() => {
    if (!page || activeLanguages.length === 0) return;
    setTranslations((prev) => {
      const next = { ...prev };
      activeLanguages.forEach((l) => {
        if (!next[l.code]) {
          next[l.code] = {
            page_id: page.id,
            language_code: l.code,
            title: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            og_image: '',
            canonical_url: '',
          };
        }
      });
      return next;
    });
  }, [page, activeLanguages]);

  const updatePageField = (field: keyof Page, value: any) => {
    if (page) setPage({ ...page, [field]: value });
  };

  const updateTranslation = (lang: string, field: keyof PageTranslation, value: any) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const handleSavePage = async () => {
    if (!page) return;
    setSaving(true);
    const { error: pErr } = await supabase
      .from('pages')
      .update({
        slug: page.slug,
        is_active: page.is_active,
        show_in_menu: page.show_in_menu,
        sort_order: page.sort_order,
      })
      .eq('id', page.id);
    if (pErr) { toast.error(pErr.message); setSaving(false); return; }

    const rows = Object.values(translations).map((t) => ({
      page_id: page.id,
      language_code: t.language_code,
      title: t.title || '',
      meta_title: t.meta_title || null,
      meta_description: t.meta_description || null,
      meta_keywords: t.meta_keywords || null,
      og_image: t.og_image || null,
      canonical_url: t.canonical_url || null,
    }));
    const { error: tErr } = await supabase
      .from('page_translations')
      .upsert(rows, { onConflict: 'page_id,language_code' });
    if (tErr) { toast.error(tErr.message); setSaving(false); return; }

    toast.success('Saqlandi');
    setSaving(false);
  };

  const addSection = async (type: string) => {
    if (!page) return;
    const newOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from('page_sections')
      .insert({ page_id: page.id, section_type: type, sort_order: newOrder })
      .select()
      .single();
    if (error) { toast.error(error.message); return; }
    // create translation rows
    const trRows = activeLanguages.map((l) => ({
      section_id: (data as any).id,
      language_code: l.code,
      heading: '',
      subheading: '',
      body: '',
    }));
    if (trRows.length) await supabase.from('page_section_translations').insert(trRows);
    toast.success('Blok qo\'shildi');
    load();
  };

  const deleteSection = async (sid: string) => {
    const { error } = await supabase.from('page_sections').delete().eq('id', sid);
    if (error) toast.error(error.message);
    else { toast.success('Blok o\'chirildi'); load(); }
  };

  const moveSection = async (sid: string, dir: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === sid);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sections.length) return;
    const a = sections[idx], b = sections[swap];
    await Promise.all([
      supabase.from('page_sections').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('page_sections').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    load();
  };

  const toggleSectionActive = async (sid: string, v: boolean) => {
    await supabase.from('page_sections').update({ is_active: v }).eq('id', sid);
    load();
  };

  const updateSectionTranslation = (sid: string, lang: string, field: keyof SectionTranslation, value: any) => {
    setSections((prev) => prev.map((s) => {
      if (s.id !== sid) return s;
      const existing = s.page_section_translations.find((t) => t.language_code === lang);
      const updated = existing
        ? s.page_section_translations.map((t) => t.language_code === lang ? { ...t, [field]: value } : t)
        : [...s.page_section_translations, { section_id: sid, language_code: lang, heading: '', subheading: '', body: '', cta_text: '', cta_url: '', image_alt: '', [field]: value } as SectionTranslation];
      return { ...s, page_section_translations: updated };
    }));
  };

  const saveSectionTranslations = async (sid: string) => {
    const sec = sections.find((s) => s.id === sid);
    if (!sec) return;
    const rows = activeLanguages.map((l) => {
      const t = sec.page_section_translations.find((x) => x.language_code === l.code);
      return {
        section_id: sid,
        language_code: l.code,
        heading: t?.heading || null,
        subheading: t?.subheading || null,
        body: t?.body || null,
        cta_text: t?.cta_text || null,
        cta_url: t?.cta_url || null,
        image_alt: t?.image_alt || null,
      };
    });
    const { error } = await supabase
      .from('page_section_translations')
      .upsert(rows, { onConflict: 'section_id,language_code' });
    if (error) toast.error(error.message);
    else toast.success('Blok saqlandi');
  };

  if (loading || langLoading) {
    return <div className="space-y-4"><Skeleton className="h-12 w-64" /><Skeleton className="h-64 w-full" /></div>;
  }
  if (!page) {
    return <Card><CardContent className="py-12 text-center">Sahifa topilmadi</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cms/pages')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sahifani tahrirlash</h1>
            <p className="text-sm text-muted-foreground">/{page.slug}</p>
          </div>
        </div>
        <Button onClick={handleSavePage} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> Sahifa sozlamalarini saqlash
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Asosiy</TabsTrigger>
          <TabsTrigger value="translations">Tarjimalar</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="sections">Bloklar ({sections.length})</TabsTrigger>
        </TabsList>

        {/* === SETTINGS === */}
        <TabsContent value="settings">
          <Card>
            <CardHeader><CardTitle>Asosiy sozlamalar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Slug (URL)</Label>
                <Input value={page.slug} disabled={page.is_system} onChange={(e) => updatePageField('slug', e.target.value)} />
                {page.is_system && <p className="text-xs text-muted-foreground mt-1">Tizim sahifasi slug'ini o'zgartirib bo'lmaydi</p>}
              </div>
              <div>
                <Label>Tartib raqami</Label>
                <Input type="number" value={page.sort_order} onChange={(e) => updatePageField('sort_order', parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Faol</Label>
                  <p className="text-sm text-muted-foreground">Saytda ko'rsatish</p>
                </div>
                <Switch checked={page.is_active} onCheckedChange={(v) => updatePageField('is_active', v)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Menyuda ko'rsatish</Label>
                  <p className="text-sm text-muted-foreground">Asosiy navigatsiyaga qo'shish</p>
                </div>
                <Switch checked={page.show_in_menu} onCheckedChange={(v) => updatePageField('show_in_menu', v)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === TRANSLATIONS === */}
        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <CardTitle>Tarjimalar</CardTitle>
              <CardDescription>Har bir til uchun sarlavhani kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLang} onValueChange={setActiveLang}>
                <TabsList>
                  {activeLanguages.map((l) => (
                    <TabsTrigger key={l.code} value={l.code}>
                      {l.flag} {l.native_name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {activeLanguages.map((l) => (
                  <TabsContent key={l.code} value={l.code} className="space-y-4">
                    <div>
                      <Label>Sarlavha *</Label>
                      <Input
                        value={translations[l.code]?.title || ''}
                        onChange={(e) => updateTranslation(l.code, 'title', e.target.value)}
                        placeholder="Sahifa sarlavhasi"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SEO === */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO sozlamalari</CardTitle>
              <CardDescription>Qidiruv tizimlari uchun meta ma'lumotlar (har bir til uchun)</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLang} onValueChange={setActiveLang}>
                <TabsList>
                  {activeLanguages.map((l) => (
                    <TabsTrigger key={l.code} value={l.code}>{l.flag} {l.native_name}</TabsTrigger>
                  ))}
                </TabsList>
                {activeLanguages.map((l) => {
                  const t = translations[l.code];
                  return (
                    <TabsContent key={l.code} value={l.code} className="space-y-4">
                      <div>
                        <Label>Meta Title (max 60)</Label>
                        <Input maxLength={60} value={t?.meta_title || ''} onChange={(e) => updateTranslation(l.code, 'meta_title', e.target.value)} />
                      </div>
                      <div>
                        <Label>Meta Description (max 160)</Label>
                        <Textarea maxLength={160} value={t?.meta_description || ''} onChange={(e) => updateTranslation(l.code, 'meta_description', e.target.value)} />
                      </div>
                      <div>
                        <Label>Meta Keywords</Label>
                        <Input value={t?.meta_keywords || ''} onChange={(e) => updateTranslation(l.code, 'meta_keywords', e.target.value)} placeholder="kalit, so'zlar, vergul bilan" />
                      </div>
                      <div>
                        <Label>Open Graph Image URL</Label>
                        <Input value={t?.og_image || ''} onChange={(e) => updateTranslation(l.code, 'og_image', e.target.value)} placeholder="https://..." />
                      </div>
                      <div>
                        <Label>Canonical URL</Label>
                        <Input value={t?.canonical_url || ''} onChange={(e) => updateTranslation(l.code, 'canonical_url', e.target.value)} placeholder="https://..." />
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SECTIONS === */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yangi blok qo'shish</CardTitle>
              <CardDescription>Sahifaga turli xil kontent bloklarini qo'shing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {SECTION_TYPES.map((t) => (
                  <Button key={t.value} variant="outline" size="sm" onClick={() => addSection(t.value)}>
                    <Plus className="w-3 h-3 mr-1" /> {t.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {sections.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">
              Hali blok yo'q. Yuqoridan blok turini tanlang.
            </CardContent></Card>
          ) : (
            <div className="space-y-3">
              {sections.map((s, idx) => {
                const typeLabel = SECTION_TYPES.find((t) => t.value === s.section_type)?.label || s.section_type;
                const tr = s.page_section_translations.find((t) => t.language_code === activeLang);
                return (
                  <Card key={s.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="secondary">{typeLabel}</Badge>
                        <Badge variant={s.is_active ? 'default' : 'outline'}>{s.is_active ? 'Faol' : 'Nofaol'}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => moveSection(s.id, -1)} disabled={idx === 0}><ChevronUp className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => moveSection(s.id, 1)} disabled={idx === sections.length - 1}><ChevronDown className="w-4 h-4" /></Button>
                        <Switch checked={s.is_active} onCheckedChange={(v) => toggleSectionActive(s.id, v)} />
                        <Button variant="ghost" size="icon" onClick={() => deleteSection(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Tabs value={activeLang} onValueChange={setActiveLang}>
                        <TabsList className="h-8">
                          {activeLanguages.map((l) => (
                            <TabsTrigger key={l.code} value={l.code} className="text-xs">{l.flag} {l.code.toUpperCase()}</TabsTrigger>
                          ))}
                        </TabsList>
                        {activeLanguages.map((l) => {
                          const lt = s.page_section_translations.find((t) => t.language_code === l.code);
                          return (
                            <TabsContent key={l.code} value={l.code} className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">Sarlavha</Label>
                                  <Input value={lt?.heading || ''} onChange={(e) => updateSectionTranslation(s.id, l.code, 'heading', e.target.value)} />
                                </div>
                                <div>
                                  <Label className="text-xs">Pastki sarlavha</Label>
                                  <Input value={lt?.subheading || ''} onChange={(e) => updateSectionTranslation(s.id, l.code, 'subheading', e.target.value)} />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Matn</Label>
                                <Textarea rows={4} value={lt?.body || ''} onChange={(e) => updateSectionTranslation(s.id, l.code, 'body', e.target.value)} />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">CTA matni</Label>
                                  <Input value={lt?.cta_text || ''} onChange={(e) => updateSectionTranslation(s.id, l.code, 'cta_text', e.target.value)} />
                                </div>
                                <div>
                                  <Label className="text-xs">CTA URL</Label>
                                  <Input value={lt?.cta_url || ''} onChange={(e) => updateSectionTranslation(s.id, l.code, 'cta_url', e.target.value)} />
                                </div>
                              </div>
                            </TabsContent>
                          );
                        })}
                      </Tabs>
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => saveSectionTranslations(s.id)}>
                          <Save className="w-3 h-3 mr-1" /> Blokni saqlash
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
