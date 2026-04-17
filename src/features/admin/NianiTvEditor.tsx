import type { MediaItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Tv, Youtube } from "lucide-react";

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function getVideoThumbnail(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
  return null;
}

type Props = {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
};

export function NianiTvEditor({ media, onChange }: Props) {
  const list = media.filter((m) => m.type === "video");

  function setAt(i: number, next: MediaItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  function addVideo() {
    onChange([...list, { url: "", title: "", type: "video", category: "other" }]);
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
            Add YouTube or direct video URLs. No file upload needed — just paste the link.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
          onClick={addVideo}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Video
        </Button>
      </div>

      {/* Empty state */}
      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center">
          <Youtube className="h-8 w-8 text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No videos yet. Click <span className="text-gold font-semibold">Add Video</span> and paste a YouTube or video URL.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((item, i) => {
            const thumb = getVideoThumbnail(item.url);
            return (
              <li
                key={i}
                className="relative rounded-lg border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/5 p-3"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 rounded overflow-hidden shrink-0 bg-black/30 flex items-center justify-center border border-gold/10">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : item.url ? (
                      <Tv className="h-6 w-6 text-gold/40" />
                    ) : (
                      <Youtube className="h-6 w-6 text-gold/30" />
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold/70">#{i + 1}</span>
                      <div className="flex items-center gap-0.5">
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-gold" disabled={i === 0} onClick={() => onChange(moveItem(list, i, i - 1))}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-gold" disabled={i === list.length - 1} onClick={() => onChange(moveItem(list, i, i + 1))}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-destructive/70 hover:text-destructive" onClick={() => onChange(list.filter((_, j) => j !== i))}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Input
                      placeholder="Title..."
                      className="h-7 text-xs border-gold/20 bg-black/20 px-2"
                      value={item.title}
                      onChange={(e) => setAt(i, { ...item, title: e.target.value })}
                    />

                    <Input
                      placeholder="YouTube URL or direct video URL..."
                      className="h-7 text-xs border-gold/20 bg-black/20 px-2"
                      value={item.url}
                      onChange={(e) => setAt(i, { ...item, url: e.target.value })}
                    />

                    {item.url && (
                      <p className="text-[10px] text-gold/50 truncate">{item.url}</p>
                    )}
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
