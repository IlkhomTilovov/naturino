import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useLanguages } from '@/hooks/useLanguages';

interface PageRow {
  id: string;
  slug: string;
  page_type: string;
  is_active: boolean;
  is_system: boolean;
  show_in_menu: boolean;
  sort_order: number;
  updated_at: string;
  page_translations: { language_code: string; title: string }[];
}

export default function CmsPages() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const { defaultLanguage, activeLanguages } = useLanguages();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('id, slug, page_type, is_active, is_system, show_in_menu, sort_order, updated_at, page_translations(language_code, title)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Sahifalarni yuklashda xatolik: ' + error.message);
    } else {
      setPages((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newSlug.trim() || !newTitle.trim()) {
      toast.error('Slug va sarlavha kerak');
      return;
    }
    if (!defaultLanguage) {
      toast.error('Avval tillarni sozlang');
      return;
    }
    setCreating(true);
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, '-');
    const { data: page, error } = await supabase
      .from('pages')
      .insert({ slug, page_type: 'static' })
      .select()
      .single();
    if (error || !page) {
      toast.error('Yaratishda xatolik: ' + error?.message);
      setCreating(false);
      return;
    }
    // Create translations for all active languages
    const translations = activeLanguages.map((l) => ({
      page_id: page.id,
      language_code: l.code,
      title: newTitle.trim(),
    }));
    if (translations.length > 0) {
      await supabase.from('page_translations').insert(translations);
    }
    toast.success('Sahifa yaratildi');
    setNewSlug('');
    setNewTitle('');
    setCreateOpen(false);
    setCreating(false);
    load();
  };

  const toggleActive = async (id: string, value: boolean) => {
    const { error } = await supabase.from('pages').update({ is_active: value }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(value ? 'Faollashtirildi' : 'O\'chirildi'); load(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Sahifa o\'chirildi'); load(); }
  };

  const getTitle = (p: PageRow) => {
    const def = p.page_translations?.find((t) => t.language_code === defaultLanguage?.code);
    return def?.title || p.page_translations?.[0]?.title || p.slug;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sahifalar CMS</h1>
          <p className="text-muted-foreground">Statik sahifalar va ularning bloklarini boshqaring</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Yangi sahifa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi sahifa yaratish</DialogTitle>
              <DialogDescription>Slug va boshlang'ich sarlavhani kiriting. Tarjimalar keyin tahrirlanadi.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Slug (URL)</Label>
                <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="masalan: kompaniya-haqida" />
              </div>
              <div>
                <Label>Sarlavha (boshlang'ich)</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Sahifa nomi" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Bekor</Button>
              <Button onClick={handleCreate} disabled={creating}>Yaratish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Hali sahifa yo'q. Birinchisini yarating.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {pages.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{getTitle(p)}</h3>
                    {p.is_system && <Badge variant="secondary">tizim</Badge>}
                    <Badge variant={p.is_active ? 'default' : 'outline'}>
                      {p.is_active ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">/{p.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.is_active} onCheckedChange={(v) => toggleActive(p.id, v)} />
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/cms/pages/${p.id}`}>
                      <Pencil className="w-4 h-4 mr-1" /> Tahrirlash
                    </Link>
                  </Button>
                  {!p.is_system && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sahifani o'chirishni tasdiqlang</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{getTitle(p)}" sahifasi va uning barcha bloklari o'chiriladi. Bu amalni qaytarib bo'lmaydi.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Bekor</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p.id)}>O'chirish</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
