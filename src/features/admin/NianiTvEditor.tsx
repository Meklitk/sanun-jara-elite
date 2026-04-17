import { useState } from "react";
import type { MediaItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Tv, Upload, Link } from "lucide-react";
import { uploadVideoFile } from "@/api/upload";
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
  if (url.includes("cloudinary.com"))
    return url.replace("/video/upload/", "/video/upload/w_320,h_180,c_fill,so_0/").replace(/\.[^.]+$/, ".jpg");
  return null;
}

type Props = {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  token: string;
};

export function NianiTvEditor({ media, onChange, token }: Props) {
  const list = media.filter((m) => m.type === "video");
  const [uploading, setUploading] = useState<number | null>(null);

  function setAt(i: number, next: MediaItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  async function handleFileUpload(file: File, i: number) {
    setUploading(i);
    try {
      const res = await uploadVideoFile(file, token);
      setAt(i, {
        ...list[i],
        url: res.media.url,
        title: list[i].title || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "),
      });
      toast.success("Video uploaded to Cloudinary");
    } catch (err: any) {
      toast.error(`Upload failed: ${err?.message ?? "Unknown error"}`);
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-gold/5 to-transparent border border-gold/10">
        <div>
          <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
            <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center">
              <Tv className="h-4 w-4 text-black" />
            </div>
            Niani TV Videos
          </Label>
          <p className="mt-2 text-xs text-muted-foreground max-w-xl">
            Paste a YouTube URL <span className="text-gold/50">or</span> upload a video from your PC — stored on Cloudinary.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold"
          onClick={() => onChange([...list, { url: "", title: "", type: "video", category: "other" }])}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Video
        </Button>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 px-6 py-12 text-center">
          <Tv className="h-8 w-8 text-gold/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No videos yet. Click <span className="text-gold font-semibold">Add Video</span> to get started.
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
                  {/* Thumbnail / preview */}
                  <div className="w-24 h-16 rounded overflow-hidden shrink-0 bg-black/30 border border-gold/10 flex items-center justify-center">
                    {busy ? (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="h-5 w-5 text-gold/60 animate-bounce" />
                        <span className="text-[9px] text-gold/50">Uploading…</span>
                      </div>
                    ) : thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Tv className="h-6 w-6 text-gold/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Row controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold/60">#{i + 1}</span>
                      <div className="flex gap-0.5">
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-gold" disabled={i === 0} onClick={() => onChange(moveItem(list, i, i - 1))}><ChevronUp className="h-3 w-3" /></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-gold" disabled={i === list.length - 1} onClick={() => onChange(moveItem(list, i, i + 1))}><ChevronDown className="h-3 w-3" /></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-destructive/70 hover:text-destructive" onClick={() => onChange(list.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>

                    {/* Title */}
                    <Input placeholder="Title…" className="h-7 text-xs border-gold/20 bg-black/20 px-2" value={item.title} onChange={(e) => setAt(i, { ...item, title: e.target.value })} />

                    {/* URL */}
                    <div className="flex items-center gap-1.5">
                      <Link className="h-3 w-3 text-gold/40 shrink-0" />
                      <Input placeholder="YouTube or video URL…" className="h-7 text-xs border-gold/20 bg-black/20 px-2" value={item.url} onChange={(e) => setAt(i, { ...item, url: e.target.value })} />
                    </div>

                    {/* File upload */}
                    <div className="flex items-center gap-1.5">
                      <Upload className="h-3 w-3 text-gold/40 shrink-0" />
                      <label className="flex-1 cursor-pointer">
                        <span className="flex h-7 items-center rounded-md border border-gold/20 bg-black/20 px-2 text-[11px] text-muted-foreground hover:border-gold/40 transition-colors">
                          {busy ? "Uploading…" : "Upload from PC (mp4, mov…)"}
                        </span>
                        <input type="file" accept="video/*" className="sr-only" disabled={busy}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleFileUpload(f, i);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                    </div>
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
