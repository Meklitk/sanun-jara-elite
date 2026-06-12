import { useState } from "react";
import type { MediaItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Clapperboard, Upload, Link } from "lucide-react";
import { getErrorMessage, uploadManagedVideoFile } from "@/api/upload";
import { toast } from "sonner";

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getThumbnail(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  if (url.includes("cloudinary.com")) {
    return url.replace("/video/upload/", "/video/upload/w_320,h_180,c_fill,so_0/").replace(/\.[^.]+$/, ".jpg");
  }
  return null;
}

function titleFromFileName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

type Props = {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  token: string;
};

export function NianiCartoonsEditor({ media, onChange, token }: Props) {
  const list = media.filter((m) => m.type === "video" && m.category === "cartoon");
  const [uploading, setUploading] = useState<number | null>(null);

  function setAt(i: number, next: MediaItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  async function handleFileUpload(file: File, i: number) {
    setUploading(i);
    const toastId = `niani-cartoon-upload-${i}-${file.name}`;

    try {
      toast.loading(`Uploading ${file.name}...`, { id: toastId });
      const { media: uploadedMedia } = await uploadManagedVideoFile(file, token);

      setAt(i, {
        ...list[i],
        url: uploadedMedia.url,
        title: list[i].title || titleFromFileName(file.name),
        type: "video",
        category: "cartoon",
      });

      toast.success("Cartoon video uploaded", { id: toastId });
    } catch (error) {
      toast.error(`Upload failed: ${getErrorMessage(error)}`, { id: toastId });
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-gold/10 bg-gradient-to-r from-gold/5 to-transparent p-4">
        <div>
          <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient-bg">
              <Clapperboard className="h-4 w-4 text-black" />
            </div>
            Niani TV — Cartoons
          </Label>
          <p className="mt-2 max-w-xl text-xs text-muted-foreground">
            Animated cartoons in Mandenka, Amharic, and other languages. Paste a YouTube URL or upload mp4/mov.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold"
          onClick={() =>
            onChange([...list, { url: "", title: "", type: "video", category: "cartoon" }])
          }
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Cartoon
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 px-6 py-12 text-center">
          <Clapperboard className="mx-auto mb-3 h-8 w-8 text-gold/30" />
          <p className="text-sm text-muted-foreground">
            No cartoons yet. Add YouTube links or upload cartoon videos from your PC.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((item, i) => {
            const thumb = getThumbnail(item.url);
            const busy = uploading === i;

            return (
              <li key={i} className="rounded-lg border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/5 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded border border-gold/10 bg-black/30">
                    {busy ? (
                      <Upload className="h-5 w-5 animate-bounce text-gold/60" />
                    ) : thumb ? (
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Clapperboard className="h-6 w-6 text-gold/30" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold/60">
                        Cartoon #{i + 1}
                      </span>
                      <div className="flex gap-0.5">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={i === 0}
                          onClick={() => onChange(moveItem(list, i, i - 1))}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={i === list.length - 1}
                          onClick={() => onChange(moveItem(list, i, i + 1))}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive/70"
                          onClick={() => onChange(list.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Input
                      placeholder="Title..."
                      className="h-7 border-gold/20 bg-black/20 px-2 text-xs"
                      value={item.title}
                      onChange={(e) => setAt(i, { ...item, title: e.target.value, category: "cartoon" })}
                    />

                    <div className="flex items-center gap-1.5">
                      <Link className="h-3 w-3 shrink-0 text-gold/40" />
                      <Input
                        placeholder="YouTube or video URL..."
                        className="h-7 border-gold/20 bg-black/20 px-2 text-xs"
                        value={item.url}
                        onChange={(e) => setAt(i, { ...item, url: e.target.value, category: "cartoon" })}
                      />
                    </div>

                    <label className="flex cursor-pointer items-center gap-1.5">
                      <Upload className="h-3 w-3 shrink-0 text-gold/40" />
                      <span className="flex h-7 flex-1 items-center rounded-md border border-gold/20 bg-black/20 px-2 text-[11px] text-muted-foreground">
                        {busy ? "Uploading..." : "Upload from PC (mp4, mov...)"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        disabled={busy}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleFileUpload(file, i);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
