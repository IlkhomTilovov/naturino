import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageUploadField } from './ImageUploadField';
import { BlockType, BLOCK_LABELS, ICON_OPTIONS, createDefaultItem } from '@/lib/pageBuilder';
import { cn } from '@/lib/utils';

export interface EditableBlock {
  localId: string;
  block_type: BlockType;
  is_active: boolean;
  data: any;
}

interface Props {
  block: EditableBlock;
  lang: string;
  langCodes: string[];
  onChange: (data: any) => void;
  onToggleActive: () => void;
  onRemove: () => void;
}

export function BlockEditorCard({ block, lang, langCodes, onChange, onToggleActive, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.localId });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const setField = (patch: any) => onChange({ ...block.data, ...patch });
  const setTranslated = (field: string, value: string) => {
    const translations = { ...(block.data.translations || {}) };
    translations[lang] = { ...(translations[lang] || {}), [field]: value };
    onChange({ ...block.data, translations });
  };
  const t = (field: string) => block.data.translations?.[lang]?.[field] || '';

  const renderItemsBlock = (type: 'features' | 'stats' | 'faq' | 'gallery') => {
    const items: any[] = block.data.items || [];
    const addItem = () => setField({ items: [...items, createDefaultItem(type, langCodes)] });
    const removeItem = (id: string) => setField({ items: items.filter((i) => i.id !== id) });
    const moveItem = (idx: number, dir: -1 | 1) => {
      const target = idx + dir;
      if (target < 0 || target >= items.length) return;
      const next = [...items];
      [next[idx], next[target]] = [next[target], next[idx]];
      setField({ items: next });
    };
    const updateItem = (id: string, patch: any) => setField({ items: items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
    const updateItemTranslated = (id: string, field: string, value: string) =>
      setField({
        items: items.map((i) => {
          if (i.id !== id) return i;
          const translations = { ...(i.translations || {}) };
          translations[lang] = { ...(translations[lang] || {}), [field]: value };
          return { ...i, translations };
        }),
      });
    const itemT = (item: any, field: string) => item.translations?.[lang]?.[field] || '';

    return (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="border rounded-lg p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={idx === 0} onClick={() => moveItem(idx, -1)}><ChevronUp className="h-3.5 w-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={idx === items.length - 1} onClick={() => moveItem(idx, 1)}><ChevronDown className="h-3.5 w-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            </div>

            {type === 'features' && (
              <>
                <Select value={item.icon} onValueChange={(v) => updateItem(item.id, { icon: v })}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2"><opt.icon className="h-3.5 w-3.5" />{opt.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Sarlavha" value={itemT(item, 'title')} onChange={(e) => updateItemTranslated(item.id, 'title', e.target.value)} />
                <Textarea placeholder="Tavsif" rows={2} value={itemT(item, 'description')} onChange={(e) => updateItemTranslated(item.id, 'description', e.target.value)} />
              </>
            )}

            {type === 'stats' && (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Raqam (masalan: 500+)" value={item.number || ''} onChange={(e) => updateItem(item.id, { number: e.target.value })} />
                <Input placeholder="Yorliq" value={itemT(item, 'label')} onChange={(e) => updateItemTranslated(item.id, 'label', e.target.value)} />
              </div>
            )}

            {type === 'faq' && (
              <>
                <Input placeholder="Savol" value={itemT(item, 'question')} onChange={(e) => updateItemTranslated(item.id, 'question', e.target.value)} />
                <Textarea placeholder="Javob" rows={2} value={itemT(item, 'answer')} onChange={(e) => updateItemTranslated(item.id, 'answer', e.target.value)} />
              </>
            )}

            {type === 'gallery' && (
              <div className="flex items-end gap-3">
                <ImageUploadField value={item.image || ''} onChange={(url) => updateItem(item.id, { image: url })} folder="gallery" className="h-20 w-28" />
                <Input className="flex-1" placeholder="Izoh (ixtiyoriy)" value={itemT(item, 'caption')} onChange={(e) => updateItemTranslated(item.id, 'caption', e.target.value)} />
              </div>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" />Element qo'shish</Button>
      </div>
    );
  };

  const renderHero = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <ImageUploadField value={block.data.image || ''} onChange={(url) => setField({ image: url })} folder="hero" label="Fon rasmi" className="h-28 w-full" />
        <div className="space-y-2"><Label>Tugma URL</Label><Input value={block.data.button_url || ''} onChange={(e) => setField({ button_url: e.target.value })} placeholder="/catalog" /></div>
      </div>
      <div className="space-y-2"><Label>Sarlavha</Label><Input value={t('title')} onChange={(e) => setTranslated('title', e.target.value)} /></div>
      <div className="space-y-2"><Label>Kichik sarlavha</Label><Input value={t('subtitle')} onChange={(e) => setTranslated('subtitle', e.target.value)} /></div>
      <div className="space-y-2"><Label>Tavsif</Label><Textarea rows={3} value={t('description')} onChange={(e) => setTranslated('description', e.target.value)} /></div>
      <div className="space-y-2"><Label>Tugma matni</Label><Input value={t('button_text')} onChange={(e) => setTranslated('button_text', e.target.value)} /></div>
    </>
  );

  const renderText = () => (
    <div className="space-y-2">
      <Label>Matn (Markdown qo'llab-quvvatlanadi)</Label>
      <Textarea rows={6} value={t('content')} onChange={(e) => setTranslated('content', e.target.value)} />
    </div>
  );

  const renderTextImage = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <ImageUploadField value={block.data.image || ''} onChange={(url) => setField({ image: url })} folder="text-image" className="h-28 w-full" />
        <div className="space-y-2">
          <Label>Rasm joylashuvi</Label>
          <Select value={block.data.image_position || 'right'} onValueChange={(v) => setField({ image_position: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Chapda</SelectItem>
              <SelectItem value="right">O'ngda</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Sarlavha</Label><Input value={t('title')} onChange={(e) => setTranslated('title', e.target.value)} /></div>
      <div className="space-y-2"><Label>Matn</Label><Textarea rows={4} value={t('content')} onChange={(e) => setTranslated('content', e.target.value)} /></div>
    </>
  );

  const renderCta = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <ImageUploadField value={block.data.background_image || ''} onChange={(url) => setField({ background_image: url })} folder="cta" label="Fon rasmi" className="h-28 w-full" />
        <div className="space-y-2"><Label>Tugma URL</Label><Input value={block.data.button_url || ''} onChange={(e) => setField({ button_url: e.target.value })} placeholder="/contact" /></div>
      </div>
      <div className="space-y-2"><Label>Sarlavha</Label><Input value={t('title')} onChange={(e) => setTranslated('title', e.target.value)} /></div>
      <div className="space-y-2"><Label>Tavsif</Label><Textarea rows={2} value={t('description')} onChange={(e) => setTranslated('description', e.target.value)} /></div>
      <div className="space-y-2"><Label>Tugma matni</Label><Input value={t('button_text')} onChange={(e) => setTranslated('button_text', e.target.value)} /></div>
    </>
  );

  const content = (() => {
    switch (block.block_type) {
      case 'hero': return renderHero();
      case 'text': return renderText();
      case 'text_image': return renderTextImage();
      case 'features': return renderItemsBlock('features');
      case 'stats': return renderItemsBlock('stats');
      case 'faq': return renderItemsBlock('faq');
      case 'cta': return renderCta();
      case 'gallery': return renderItemsBlock('gallery');
      default: return null;
    }
  })();

  return (
    <Card ref={setNodeRef} style={style} className={cn('border', !block.is_active && 'opacity-60')}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
        <div className="flex items-center gap-2">
          <button type="button" className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none" {...attributes} {...listeners} aria-label="Tartibni o'zgartirish">
            <GripVertical className="h-4 w-4" />
          </button>
          <Badge variant="outline">{BLOCK_LABELS[block.block_type]}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={block.is_active} onCheckedChange={onToggleActive} aria-label="Faol" />
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">{content}</CardContent>
    </Card>
  );
}
