import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  createTombouctouGalleryItem,
  deleteTombouctouGalleryItem,
  listTombouctouGallery,
  reorderTombouctouGallery,
  updateTombouctouGalleryItem,
} from "@/api/tombouctou-gallery";
import { getErrorMessage } from "@/api/upload";
import type { TombouctouGalleryItem, TombouctouGallerySize } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SIZES: TombouctouGallerySize[] = ["small", "medium", "large", "tall", "wide"];

type Props = {
  token: string;
};

export default function AdminTombouctouGalleryEditor({ token }: Props) {
  const [items, setItems] = useState<TombouctouGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await listTombouctouGallery();
      setItems(res.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, token]);

  async function onUpload(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    let success = 0;
    try {
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        const size = SIZES[i % SIZES.length];
        const baseName = file.name.replace(/\.[^.]+$/, "");
        await createTombouctouGalleryItem(file, token, {
          title: { en: baseName, fr: baseName },
          altText: { en: baseName, fr: baseName },
          size,
          isFeatured: items.length === 0 && i === 0,
        });
        success++;
      }
      toast.success(`${success} image${success > 1 ? "s" : ""} uploaded`);
      await refresh();
    } catch (err) {
      const message = getErrorMessage(err, "Upload failed");
      toast.error(message.includes("not_found") ? "Gallery API not available — redeploy the Railway backend, then try again." : message);
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Remove this gallery image?")) return;
    setBusyId(id);
    try {
      await deleteTombouctouGalleryItem(id, token);
      toast.success("Image removed");
      await refresh();
    } catch {
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);

    setItems(next);
    setBusyId(moved._id);
    try {
      await reorderTombouctouGallery(
        next.map((item) => item._id),
        token
      );
      await refresh();
    } catch {
      toast.error("Reorder failed");
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function setFeatured(id: string) {
    setBusyId(id);
    try {
      await updateTombouctouGalleryItem(id, { isFeatured: true }, token);
      toast.success("Featured image updated");
      await refresh();
    } catch {
      toast.error("Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function updateField(
    id: string,
    field: "title" | "caption" | "altText",
    lang: "en" | "fr",
    value: string
  ) {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const current = { ...(item[field] ?? {}), [lang]: value };
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, [field]: current } : i))
    );
  }

  async function saveItem(id: string) {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    setBusyId(id);
    try {
      await updateTombouctouGalleryItem(
        id,
        {
          title: item.title,
          caption: item.caption,
          altText: item.altText,
          size: item.size,
        },
        token
      );
      toast.success("Saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onSizeChange(id: string, size: TombouctouGallerySize) {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, size } : i)));
    setBusyId(id);
    try {
      await updateTombouctouGalleryItem(id, { size }, token);
    } catch {
      toast.error("Size update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Tombouctou Multimedia Gallery</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Upload, reorder, and manage exhibition images for the public Tombouctou gallery.
            Each image supports title, caption, alt text, and display size. Mark one as featured
            for the cinematic hero showcase.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="border-gold/25 text-xs" asChild>
            <a href="/tombouctou" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </a>
          </Button>
          <Label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length) void onUpload(files);
                e.currentTarget.value = "";
              }}
            />
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gold/25 bg-black/30 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/10">
              <ImagePlus className="h-3.5 w-3.5" />
              {uploading ? "Uploading…" : "Upload images"}
            </span>
          </Label>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-8 text-sm text-muted-foreground">
          Loading gallery…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-8 text-sm text-muted-foreground">
          No gallery images yet. Upload images to build the Tombouctou exhibition.
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {items.length} image{items.length !== 1 ? "s" : ""} in collection
          </p>
          {items.map((item, index) => {
            const busy = busyId === item._id;
            return (
              <div
                key={item._id}
                className={`rounded-xl border p-4 ${
                  item.isFeatured
                    ? "border-gold/40 bg-gold/5"
                    : "border-white/8 bg-black/20"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="relative shrink-0 lg:w-40">
                    <img
                      src={item.url}
                      alt=""
                      className="h-28 w-full rounded-lg border border-gold/20 object-cover lg:h-32"
                    />
                    {item.isFeatured ? (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full border border-gold/30 bg-black/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                        <Star className="h-3 w-3 fill-gold" />
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Title (EN)</Label>
                        <Input
                          value={item.title?.en ?? ""}
                          className="mt-1 h-8 border-gold/15 bg-black/30 text-sm"
                          onChange={(e) => updateField(item._id, "title", "en", e.target.value)}
                          onBlur={() => void saveItem(item._id)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Title (FR)</Label>
                        <Input
                          value={item.title?.fr ?? ""}
                          className="mt-1 h-8 border-gold/15 bg-black/30 text-sm"
                          onChange={(e) => updateField(item._id, "title", "fr", e.target.value)}
                          onBlur={() => void saveItem(item._id)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Caption (EN)</Label>
                        <Textarea
                          value={item.caption?.en ?? ""}
                          rows={2}
                          className="mt-1 border-gold/15 bg-black/30 text-sm"
                          onChange={(e) => updateField(item._id, "caption", "en", e.target.value)}
                          onBlur={() => void saveItem(item._id)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Caption (FR)</Label>
                        <Textarea
                          value={item.caption?.fr ?? ""}
                          rows={2}
                          className="mt-1 border-gold/15 bg-black/30 text-sm"
                          onChange={(e) => updateField(item._id, "caption", "fr", e.target.value)}
                          onBlur={() => void saveItem(item._id)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Alt text (EN)</Label>
                        <Input
                          value={item.altText?.en ?? ""}
                          className="mt-1 h-8 border-gold/15 bg-black/30 text-sm"
                          onChange={(e) => updateField(item._id, "altText", "en", e.target.value)}
                          onBlur={() => void saveItem(item._id)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Alt text (FR)</Label>
                        <Input
                          value={item.altText?.fr ?? ""}
                          className="mt-1 h-8 border-gold/15 bg-black/30 text-sm"
                          onChange={(e) => updateField(item._id, "altText", "fr", e.target.value)}
                          onBlur={() => void saveItem(item._id)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={item.size}
                        onValueChange={(v) => void onSizeChange(item._id, v as TombouctouGallerySize)}
                      >
                        <SelectTrigger className="h-8 w-32 border-gold/15 bg-black/30 text-xs">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!item.isFeatured ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 border-gold/20 text-xs"
                          disabled={busy}
                          onClick={() => void setFeatured(item._id)}
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Set featured
                        </Button>
                      ) : null}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-gold/20 text-xs"
                        disabled={busy || index === 0}
                        onClick={() => void moveItem(index, -1)}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-gold/20 text-xs"
                        disabled={busy || index === items.length - 1}
                        onClick={() => void moveItem(index, 1)}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-red-500/30 text-xs text-red-400 hover:bg-red-500/10"
                        disabled={busy}
                        onClick={() => void onDelete(item._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
