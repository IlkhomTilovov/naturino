import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, GripVertical, Star, Loader2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLanguages, type LanguageRow } from '@/hooks/useLanguages';
import { cn } from '@/lib/utils';

interface FormState {
  code: string;
  name: string;
  native_name: string;
  flag: string;
}

const emptyForm: FormState = { code: '', name: '', native_name: '', flag: '' };

function SortableRow({
  lang,
  onEdit,
  onDelete,
  onToggleActive,
  onSetDefault,
  busy,
}: {
  lang: LanguageRow;
  onEdit: (l: LanguageRow) => void;
  onDelete: (l: LanguageRow) => void;
  onToggleActive: (l: LanguageRow) => void;
  onSetDefault: (l: LanguageRow) => void;
  busy: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lang.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted/70 rounded-lg border border-border/50 transition-colors',
        lang.is_default && 'border-primary/60 bg-primary/5',
      )}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
        aria-label="Tartibni o'zgartirish"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-3">
        {lang.flag && <span className="text-lg">{lang.flag}</span>}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{lang.native_name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-background border text-muted-foreground uppercase">
              {lang.code}
            </span>
            {lang.is_default && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary text-primary-foreground uppercase tracking-wide">
                Asosiy
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{lang.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSetDefault(lang)}
          disabled={busy || lang.is_default}
          title="Asosiy til qilish"
          className="h-8 w-8 p-0"
        >
          <Star className={cn('h-4 w-4', lang.is_default && 'fill-primary text-primary')} />
        </Button>

        <Switch
          checked={lang.is_active}
          onCheckedChange={() => onToggleActive(lang)}
          disabled={busy || lang.is_default}
          aria-label="Faollik"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(lang)}
          disabled={busy}
          className="h-8 w-8 p-0"
          title="Tahrirlash"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(lang)}
          disabled={busy || lang.is_default}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          title="O'chirish"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function LanguageManager() {
  const { languages, loading, refresh } = useLanguages();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LanguageRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LanguageRow | null>(null);
  const [items, setItems] = useState<LanguageRow[]>([]);

  useEffect(() => {
    setItems(languages);
  }, [languages]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (lang: LanguageRow) => {
    setEditing(lang);
    setForm({
      code: lang.code,
      name: lang.name,
      native_name: lang.native_name,
      flag: lang.flag || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const code = form.code.trim().toLowerCase();
    if (!code || !form.name.trim() || !form.native_name.trim()) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Kod, nom va mahalliy nom majburiy' });
      return;
    }
    if (!/^[a-z]{2,5}$/.test(code)) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Til kodi 2-5 ta lotin harfidan iborat bo\'lishi kerak (masalan: uz, ru, en, kz)' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code,
        name: form.name.trim(),
        native_name: form.native_name.trim(),
        flag: form.flag.trim() || null,
      };

      if (editing) {
        const { error } = await supabase
          .from('languages' as any)
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
        toast({ title: 'Saqlandi', description: `${payload.native_name} yangilandi` });
      } else {
        const maxOrder = items.reduce((m, l) => Math.max(m, l.sort_order), 0);
        const isFirst = items.length === 0;
        const { error } = await supabase
          .from('languages' as any)
          .insert([{
            ...payload,
            sort_order: maxOrder + 1,
            is_active: true,
            is_default: isFirst, // first language becomes default
          }]);
        if (error) throw error;
        toast({ title: 'Qo\'shildi', description: `${payload.native_name} qo'shildi` });
      }

      setDialogOpen(false);
      await refresh();
    } catch (e: any) {
      const msg = e.message?.includes('duplicate') || e.code === '23505'
        ? `"${code}" kodli til allaqachon mavjud`
        : e.message;
      toast({ variant: 'destructive', title: 'Xatolik', description: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('languages' as any).delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast({ title: 'O\'chirildi', description: `${deleteTarget.native_name} o'chirildi` });
      setDeleteTarget(null);
      await refresh();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const handleToggleActive = async (lang: LanguageRow) => {
    if (lang.is_default) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Asosiy tilni o\'chirib bo\'lmaydi' });
      return;
    }
    const activeCount = items.filter((l) => l.is_active).length;
    if (lang.is_active && activeCount <= 1) {
      toast({ variant: 'destructive', title: 'Xatolik', description: 'Kamida bitta til faol bo\'lishi kerak' });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase
        .from('languages' as any)
        .update({ is_active: !lang.is_active })
        .eq('id', lang.id);
      if (error) throw error;
      await refresh();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const handleSetDefault = async (lang: LanguageRow) => {
    if (lang.is_default) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from('languages' as any)
        .update({ is_default: true })
        .eq('id', lang.id);
      if (error) throw error;
      toast({ title: 'Saqlandi', description: `${lang.native_name} asosiy til qilindi` });
      await refresh();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next); // optimistic

    setBusy(true);
    try {
      // Persist new sort_order for each row
      const updates = next.map((l, idx) =>
        supabase.from('languages' as any).update({ sort_order: idx + 1 }).eq('id', l.id),
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
      await refresh();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: e.message });
      setItems(languages); // revert
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Til sozlamalari</CardTitle>
          <CardDescription>
            Saytda foydalaniladigan tillarni qo'shing, tahrirlang yoki o'chiring. Asosiy til avtomatik faol bo'ladi.
          </CardDescription>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Til qo'shish
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Yuklanmoqda...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-3">Hozircha hech qanday til qo'shilmagan</p>
            <Button onClick={openCreate} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Birinchi tilni qo'shish
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Til qo'shilmaguncha sayt UZ/RU bilan ishlashda davom etadi
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((lang) => (
                  <SortableRow
                    key={lang.id}
                    lang={lang}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onToggleActive={handleToggleActive}
                    onSetDefault={handleSetDefault}
                    busy={busy}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Tilni tahrirlash' : 'Yangi til qo\'shish'}</DialogTitle>
            <DialogDescription>
              Til kodi (ISO 639-1) — masalan: uz, ru, en, kz, tr, ar, zh, de, fr
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lang-code">Kod *</Label>
                <Input
                  id="lang-code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="uz"
                  maxLength={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lang-flag">Bayroq / belgi</Label>
                <Input
                  id="lang-flag"
                  value={form.flag}
                  onChange={(e) => setForm({ ...form, flag: e.target.value })}
                  placeholder="🇺🇿"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lang-native">Mahalliy nom *</Label>
              <Input
                id="lang-native"
                value={form.native_name}
                onChange={(e) => setForm({ ...form, native_name: e.target.value })}
                placeholder="O'zbekcha"
              />
              <p className="text-xs text-muted-foreground">Til o'z nomida (masalan: Русский, English)</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lang-name">Inglizcha nom *</Label>
              <Input
                id="lang-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Uzbek"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Bekor qilish
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editing ? 'Saqlash' : 'Qo\'shish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tilni o'chirish?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.native_name}" tili o'chiriladi. Bu tildagi tarjimalar keyingi bosqichda ham yo'qoladi.
              Davom etilsinmi?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
