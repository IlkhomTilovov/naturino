import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, ExternalLink, Files } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useLanguages } from '@/hooks/useLanguages';
import { ImageUploadField } from '@/components/admin/cms/ImageUploadField';
import { BlockEditorCard, type EditableBlock } from '@/components/admin/cms/BlockEditorCard';
import { BLOCK_DEFS, type BlockType, createDefaultBlockData, genId } from '@/lib/pageBuilder';

interface TranslationFields { title: string; subtitle: string; description: string; content: string }
const emptyTranslation: TranslationFields = { title: '', subtitle: '', description: '', content: '' };

const translitMap: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya','ў':'o','қ':'q','ғ':'g','ҳ':'h',
};
const generateSlug = (name: string) =>
  name.toLowerCase().split('').map((c) => translitMap[c] ?? c).join('')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

export default function CmsPageEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeLanguages, defaultLanguage, loading: langsLoading } = useLanguages();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [editingLang, setEditingLang] = useState('');
  const [slugError, setSlugError] = useState('');

  const [general, setGeneral] = useState({ title: '', slug: '', featured_image: '', status: 'draft' as 'draft' | 'published' });
  const [translations, setTranslations] = useState<Record<string, TranslationFields>>({});
  const [blocks, setBlocks] = useState<EditableBlock[]>([]);

  const langCodes = useMemo(() => activeLanguages.map((l) => l.code), [activeLanguages]);

  useEffect(() => {
    if (langCodes.length === 0) return;
    setTranslations((prev) => {
      let changed = false;
      const next = { ...prev };
      langCodes.forEach((code) => {
        if (!next[code]) { next[code] = { ...emptyTranslation }; changed = true; }
      });
      return changed ? next : prev;
    });
  }, [langCodes]);

  useEffect(() => {
    if (!editingLang && (defaultLanguage?.code || langCodes[0])) {
      setEditingLang(defaultLanguage?.code || langCodes[0]);
    }
  }, [defaultLanguage, langCodes, editingLang]);

  useEffect(() => {
    if (!isNew) fetchPage();
  }, [id]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const { data: page, error } = await supabase.from('cms_pages' as any).select('*').eq('id', id).single() as any;
      if (error) throw error;
      setGeneral({
        title: page.title,
        slug: page.slug,
        featured_image: page.featured_image || '',
        status: page.status,
      });

      const { data: trs } = await supabase.from('cms_page_translations' as any).select('*').eq('page_id', id);
      const trMap: Record<string, TranslationFields> = {};
      (trs || []).forEach((row: any) => {
        trMap[row.language_code] = {
          title: row.title || '', subtitle: row.subtitle || '', description: row.description || '', content: row.content || '',
        };
      });
      setTranslations(trMap);

      const { data: blockRows } = await supabase.from('cms_page_blocks' as any).select('*').eq('page_id', id).order('sort_order', { ascending: true });
      setBlocks((blockRows || []).map((b: any) => ({ localId: b.id, block_type: b.block_type, is_active: b.is_active, data: b.data })));
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: err.message });
      navigate('/admin/cms/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    const next = { ...general, title: value };
    if (!general.slug || general.slug === generateSlug(general.title)) {
      next.slug = generateSlug(value);
    }
    setGeneral(next);
  };

  const checkSlugUnique = async (slug: string) => {
    const q = supabase.from('cms_pages' as any).select('id').eq('slug', slug);
    if (!isNew) q.neq('id', id);
    const { data } = await q;
    return !data || data.length === 0;
  };

  const handleSlugChange = async (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    setGeneral({ ...general, slug: clean });
    if (clean) {
      const ok = await checkSlugUnique(clean);
      setSlugError(ok ? '' : 'Bu slug allaqachon mavjud');
    } else setSlugError('');
  };

  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [...prev, { localId: genId(), block_type: type, is_active: true, data: createDefaultBlockData(type, langCodes) }]);
  };
  const updateBlockData = (localId: string, data: any) => setBlocks((prev) => prev.map((b) => (b.localId === localId ? { ...b, data } : b)));
  const toggleBlockActive = (localId: string) => setBlocks((prev) => prev.map((b) => (b.localId === localId ? { ...b, is_active: !b.is_active } : b)));
  const removeBlock = (localId: string) => setBlocks((prev) => prev.filter((b) => b.localId !== localId));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.localId === active.id);
      const newIndex = prev.findIndex((b) => b.localId === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSave = async () => {
    if (!general.title.trim()) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Sahifa nomini kiriting' });
      setActiveTab('general');
      return;
    }
    const slug = general.slug || generateSlug(general.title);
    const ok = await checkSlugUnique(slug);
    if (!ok) {
      setSlugError('Bu slug allaqachon mavjud');
      setActiveTab('general');
      return;
    }

    setSaving(true);
    try {
      let pageId = id as string;
      const pagePayload = {
        title: general.title.trim(),
        slug,
        featured_image: general.featured_image || null,
        status: general.status,
        published_at: general.status === 'published' ? new Date().toISOString() : null,
      };

      if (isNew) {
        const { data, error } = await supabase.from('cms_pages' as any).insert([pagePayload]).select('id').single() as any;
        if (error) throw error;
        pageId = data.id;
      } else {
        const { error } = await supabase.from('cms_pages' as any).update(pagePayload).eq('id', pageId);
        if (error) throw error;
      }

      if (langCodes.length > 0) {
        const trRows = langCodes.map((code) => ({
          page_id: pageId,
          language_code: code,
          title: translations[code]?.title || null,
          subtitle: translations[code]?.subtitle || null,
          description: translations[code]?.description || null,
          content: translations[code]?.content || null,
        }));
        const { error } = await supabase.from('cms_page_translations' as any).upsert(trRows, { onConflict: 'page_id,language_code' });
        if (error) throw error;
      }

      // Blocks are edited together as a unit in this form, so a full replace is simpler
      // and safer than diffing inserts/updates/deletes against the previous saved state.
      await supabase.from('cms_page_blocks' as any).delete().eq('page_id', pageId);
      if (blocks.length > 0) {
        const blockRows = blocks.map((b, idx) => ({
          page_id: pageId, block_type: b.block_type, sort_order: idx, is_active: b.is_active, data: b.data,
        }));
        const { error } = await supabase.from('cms_page_blocks' as any).insert(blockRows);
        if (error) throw error;
      }

      toast({ title: 'Saqlandi', description: isNew ? 'Sahifa yaratildi' : 'Sahifa yangilandi' });
      navigate('/admin/cms/pages');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || langsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const langSwitcher = activeLanguages.length > 0 && (
    <Tabs value={editingLang} onValueChange={setEditingLang}>
      <TabsList>
        {activeLanguages.map((l) => (
          <TabsTrigger key={l.code} value={l.code} className="gap-1">
            {l.flag && <span>{l.flag}</span>}<span className="uppercase">{l.code}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  const tr = translations[editingLang] || emptyTranslation;
  const setTr = (patch: Partial<TranslationFields>) =>
    setTranslations((prev) => ({ ...prev, [editingLang]: { ...(prev[editingLang] || emptyTranslation), ...patch } }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cms/pages')}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Files className="h-6 w-6" />{isNew ? 'Yangi sahifa' : general.title || 'Sahifani tahrirlash'}</h1>
            {!isNew && <p className="text-muted-foreground text-sm">/page/{general.slug}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button variant="outline" asChild>
              <a href={`/page/${general.slug}?preview=1`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />Ko'rib chiqish
              </a>
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !!slugError}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Saqlash
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="general">Umumiy</TabsTrigger>
          <TabsTrigger value="translations">Tarjimalar</TabsTrigger>
          <TabsTrigger value="blocks">Bloklar ({blocks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Sahifa nomi *</Label>
                <Input value={general.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Masalan: Kompaniya haqida" />
                <p className="text-xs text-muted-foreground">Bu nom faqat admin panelida ko'rinadi, saytda emas</p>
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input value={general.slug} onChange={(e) => handleSlugChange(e.target.value)} placeholder="avtomatik" className={slugError ? 'border-destructive' : ''} />
                {slugError ? <p className="text-sm text-destructive">{slugError}</p> : <p className="text-sm text-muted-foreground">URL: /page/{general.slug || 'slug'}</p>}
              </div>
              <ImageUploadField value={general.featured_image} onChange={(url) => setGeneral({ ...general, featured_image: url })} folder="featured" label="Asosiy rasm" className="h-32 w-52" />
              <div className="flex items-center gap-3 pt-2">
                <Switch checked={general.status === 'published'} onCheckedChange={(c) => setGeneral({ ...general, status: c ? 'published' : 'draft' })} />
                <Label>{general.status === 'published' ? "E'lon qilingan" : 'Qoralama'}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations" className="mt-4 space-y-4">
          {langSwitcher}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2"><Label>Sarlavha</Label><Input value={tr.title} onChange={(e) => setTr({ title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Kichik sarlavha</Label><Input value={tr.subtitle} onChange={(e) => setTr({ subtitle: e.target.value })} /></div>
              <div className="space-y-2"><Label>Tavsif</Label><Textarea rows={3} value={tr.description} onChange={(e) => setTr({ description: e.target.value })} /></div>
              <div className="space-y-2"><Label>Matn (Markdown qo'llab-quvvatlanadi)</Label><Textarea rows={6} value={tr.content} onChange={(e) => setTr({ content: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            {langSwitcher}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Blok qo'shish</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {BLOCK_DEFS.map((def) => (
                  <DropdownMenuItem key={def.type} onClick={() => addBlock(def.type)} className="gap-2">
                    <def.icon className="h-4 w-4" />{def.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {blocks.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Hozircha bloklar yo'q. "Blok qo'shish" tugmasini bosing.</CardContent></Card>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map((b) => b.localId)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {blocks.map((block) => (
                    <BlockEditorCard
                      key={block.localId}
                      block={block}
                      lang={editingLang}
                      langCodes={langCodes}
                      onChange={(data) => updateBlockData(block.localId, data)}
                      onToggleActive={() => toggleBlockActive(block.localId)}
                      onRemove={() => removeBlock(block.localId)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
