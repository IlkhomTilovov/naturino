import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Layers, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProductLine {
  id: string;
  brand_id: string | null;
  slug: string;
  name_uz: string;
  name_ru: string;
  tagline_uz: string | null;
  tagline_ru: string | null;
  for_whom_uz: string | null;
  for_whom_ru: string | null;
  problem_solved_uz: string | null;
  problem_solved_ru: string | null;
  composition_uz: string | null;
  composition_ru: string | null;
  advantages_uz: string[] | null;
  advantages_ru: string[] | null;
  recommended_age: string | null;
  contraindications_uz: string | null;
  contraindications_ru: string | null;
  banner: string | null;
  is_active: boolean;
  sort_order: number;
}

interface Brand { id: string; name_uz: string; }

const empty = {
  brand_id: '', slug: '', name_uz: '', name_ru: '',
  tagline_uz: '', tagline_ru: '',
  for_whom_uz: '', for_whom_ru: '',
  problem_solved_uz: '', problem_solved_ru: '',
  composition_uz: '', composition_ru: '',
  advantages_uz: '', advantages_ru: '',
  recommended_age: '',
  contraindications_uz: '', contraindications_ru: '',
  banner: '', is_active: true, sort_order: 0,
};

const TABLE = 'product_lines' as any;

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

export default function ProductLines() {
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ProductLine | null>(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: l }, { data: b }] = await Promise.all([
      (supabase as any).from(TABLE).select('*').order('sort_order'),
      supabase.from('brands').select('id, name_uz').order('name_uz'),
    ]);
    setLines((l || []) as ProductLine[]);
    setBrands((b || []) as Brand[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setSelected(null);
    setForm({ ...empty, sort_order: lines.length });
    setDialogOpen(true);
  };

  const openEdit = (l: ProductLine) => {
    setSelected(l);
    setForm({
      brand_id: l.brand_id || '', slug: l.slug,
      name_uz: l.name_uz, name_ru: l.name_ru,
      tagline_uz: l.tagline_uz || '', tagline_ru: l.tagline_ru || '',
      for_whom_uz: l.for_whom_uz || '', for_whom_ru: l.for_whom_ru || '',
      problem_solved_uz: l.problem_solved_uz || '', problem_solved_ru: l.problem_solved_ru || '',
      composition_uz: l.composition_uz || '', composition_ru: l.composition_ru || '',
      advantages_uz: (l.advantages_uz || []).join('\n'),
      advantages_ru: (l.advantages_ru || []).join('\n'),
      recommended_age: l.recommended_age || '',
      contraindications_uz: l.contraindications_uz || '', contraindications_ru: l.contraindications_ru || '',
      banner: l.banner || '', is_active: l.is_active, sort_order: l.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name_uz || !form.name_ru) {
      toast({ variant: 'destructive', title: 'Xatolik', description: "Nom to'ldirilishi shart" });
      return;
    }
    const slug = form.slug || slugify(form.name_uz);
    const payload: any = {
      brand_id: form.brand_id || null,
      slug,
      name_uz: form.name_uz, name_ru: form.name_ru,
      tagline_uz: form.tagline_uz || null, tagline_ru: form.tagline_ru || null,
      for_whom_uz: form.for_whom_uz || null, for_whom_ru: form.for_whom_ru || null,
      problem_solved_uz: form.problem_solved_uz || null, problem_solved_ru: form.problem_solved_ru || null,
      composition_uz: form.composition_uz || null, composition_ru: form.composition_ru || null,
      advantages_uz: form.advantages_uz.split('\n').map(s => s.trim()).filter(Boolean),
      advantages_ru: form.advantages_ru.split('\n').map(s => s.trim()).filter(Boolean),
      recommended_age: form.recommended_age || null,
      contraindications_uz: form.contraindications_uz || null,
      contraindications_ru: form.contraindications_ru || null,
      banner: form.banner || null,
      is_active: form.is_active, sort_order: form.sort_order,
    };
    try {
      if (selected) {
        const { error } = await (supabase as any).from(TABLE).update(payload).eq('id', selected.id);
        if (error) throw error;
        toast({ title: 'Yangilandi' });
      } else {
        const { error } = await (supabase as any).from(TABLE).insert([payload]);
        if (error) throw error;
        toast({ title: 'Yaratildi' });
      }
      setDialogOpen(false);
      fetchAll();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: e.message });
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    const { error } = await (supabase as any).from(TABLE).delete().eq('id', selected.id);
    if (error) { toast({ variant: 'destructive', title: 'Xatolik', description: error.message }); return; }
    toast({ title: "O'chirildi" });
    setDeleteOpen(false);
    fetchAll();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Layers className="h-6 w-6" />Mahsulot liniyalari</h1>
          <p className="text-muted-foreground">Royal Canin Sterilised, Pro Plan Sensitive kabi mahsulot liniyalari</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Yangi liniya</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Liniyalar ({lines.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Brend</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map(l => {
                const brand = brands.find(b => b.id === l.brand_id);
                return (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name_uz}<div className="text-xs text-muted-foreground">{l.name_ru}</div></TableCell>
                    <TableCell>{brand?.name_uz || '—'}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-2 py-1 rounded">/liniya/{l.slug}</code></TableCell>
                    <TableCell><Badge variant={l.is_active ? 'default' : 'secondary'}>{l.is_active ? 'Faol' : 'Nofaol'}</Badge></TableCell>
                    <TableCell className="text-right">
                      <a href={`/liniya/${l.slug}`} target="_blank" rel="noopener noreferrer" className="inline-block mr-2 text-muted-foreground hover:text-primary"><ExternalLink className="h-4 w-4" /></a>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelected(l); setDeleteOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {lines.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Hozircha liniyalar yo'q. "Yangi liniya" tugmasini bosing.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selected ? 'Liniyani tahrirlash' : 'Yangi liniya'}</DialogTitle></DialogHeader>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Asosiy</TabsTrigger>
              <TabsTrigger value="expert">Ekspert</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nomi (UZ) *</Label><Input value={form.name_uz} onChange={e => setForm({...form, name_uz: e.target.value, slug: form.slug || slugify(e.target.value)})} /></div>
                <div><Label>Nomi (RU) *</Label><Input value={form.name_ru} onChange={e => setForm({...form, name_ru: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Brend</Label>
                  <Select value={form.brand_id} onValueChange={v => setForm({...form, brand_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                    <SelectContent>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name_uz}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({...form, slug: slugify(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tagline (UZ)</Label><Input value={form.tagline_uz} onChange={e => setForm({...form, tagline_uz: e.target.value})} /></div>
                <div><Label>Tagline (RU)</Label><Input value={form.tagline_ru} onChange={e => setForm({...form, tagline_ru: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tavsiya etilgan yosh</Label><Input value={form.recommended_age} placeholder="Puppy, Adult, Senior..." onChange={e => setForm({...form, recommended_age: e.target.value})} /></div>
                <div><Label>Tartib</Label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} /></div>
              </div>
              <div className="flex items-center gap-3"><Switch checked={form.is_active} onCheckedChange={c => setForm({...form, is_active: c})} /><Label>Faol</Label></div>
            </TabsContent>

            <TabsContent value="expert" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Kim uchun (UZ)</Label><Textarea rows={3} value={form.for_whom_uz} onChange={e => setForm({...form, for_whom_uz: e.target.value})} /></div>
                <div><Label>Kim uchun (RU)</Label><Textarea rows={3} value={form.for_whom_ru} onChange={e => setForm({...form, for_whom_ru: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Qanday muammoni hal qiladi (UZ)</Label><Textarea rows={3} value={form.problem_solved_uz} onChange={e => setForm({...form, problem_solved_uz: e.target.value})} /></div>
                <div><Label>Какую проблему решает (RU)</Label><Textarea rows={3} value={form.problem_solved_ru} onChange={e => setForm({...form, problem_solved_ru: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tarkib (UZ)</Label><Textarea rows={3} value={form.composition_uz} onChange={e => setForm({...form, composition_uz: e.target.value})} /></div>
                <div><Label>Состав (RU)</Label><Textarea rows={3} value={form.composition_ru} onChange={e => setForm({...form, composition_ru: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Afzalliklar (UZ) — har birini yangi qatorda</Label><Textarea rows={4} value={form.advantages_uz} onChange={e => setForm({...form, advantages_uz: e.target.value})} /></div>
                <div><Label>Преимущества (RU)</Label><Textarea rows={4} value={form.advantages_ru} onChange={e => setForm({...form, advantages_ru: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Qarshi ko'rsatmalar (UZ)</Label><Textarea rows={2} value={form.contraindications_uz} onChange={e => setForm({...form, contraindications_uz: e.target.value})} /></div>
                <div><Label>Противопоказания (RU)</Label><Textarea rows={2} value={form.contraindications_ru} onChange={e => setForm({...form, contraindications_ru: e.target.value})} /></div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-4">
              <div><Label>Banner URL</Label><Input value={form.banner} onChange={e => setForm({...form, banner: e.target.value})} placeholder="https://..." /></div>
              {form.banner && <img src={form.banner} alt="Banner" className="rounded-lg max-h-40 object-cover" />}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
            <Button onClick={handleSubmit}>{selected ? 'Saqlash' : 'Yaratish'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Liniyani o'chirish</AlertDialogTitle>
            <AlertDialogDescription>"{selected?.name_uz}" liniyasini o'chirmoqchimisiz?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">O'chirish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
