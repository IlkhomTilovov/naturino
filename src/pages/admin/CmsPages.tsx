import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ExternalLink, Eye, EyeOff, Files, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  updated_at: string;
}

export default function CmsPages() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PageRow | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cms_pages' as any)
        .select('id, title, slug, status, updated_at')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setPages((data as any) || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const togglePublish = async (page: PageRow) => {
    const nextStatus = page.status === 'published' ? 'draft' : 'published';
    setBusy(true);
    try {
      const { error } = await supabase
        .from('cms_pages' as any)
        .update({ status: nextStatus, published_at: nextStatus === 'published' ? new Date().toISOString() : null })
        .eq('id', page.id);
      if (error) throw error;
      toast({ title: 'Saqlandi', description: nextStatus === 'published' ? "Sahifa e'lon qilindi" : 'Sahifa qoralama qilindi' });
      fetchPages();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: err.message });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('cms_pages' as any).delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast({ title: 'Muvaffaqiyat', description: "Sahifa o'chirildi" });
      setDeleteTarget(null);
      fetchPages();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Xatolik', description: err.message });
    } finally {
      setBusy(false);
    }
  };

  const filtered = pages.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Files className="h-6 w-6" />Sahifalar</h1>
          <p className="text-muted-foreground">Page builder bilan statik sahifalarni boshqaring</p>
        </div>
        <Button onClick={() => navigate('/admin/cms/pages/new')}><Plus className="mr-2 h-4 w-4" />Yangi sahifa</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Sahifa nomi yoki slug..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Barcha sahifalar ({filtered.length})</span>
            <Badge variant="outline" className="font-normal">{pages.filter((p) => p.status === 'published').length} e'lon qilingan</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sarlavha</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Yangilangan</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell><code className="text-xs bg-muted px-2 py-1 rounded">/page/{p.slug}</code></TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                      {p.status === 'published' ? "E'lon qilingan" : 'Qoralama'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(p.updated_at).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/page/${p.slug}?preview=1`} target="_blank" rel="noopener noreferrer" title="Ko'rib chiqish" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button variant="ghost" size="icon" disabled={busy} title={p.status === 'published' ? "Qoralama qilish" : "E'lon qilish"} onClick={() => togglePublish(p)}>
                        {p.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/cms/pages/${p.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Files className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">Sahifalar topilmadi</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sahifani o'chirish?</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham "{deleteTarget?.title}" sahifasini o'chirmoqchimisiz? Barcha bloklar va tarjimalar ham o'chiriladi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
