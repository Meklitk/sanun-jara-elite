import type { MediaItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Film, Mic, FileText, Play } from "lucide-react";
import { uploadFile, uploadVideoFile, getCloudinarySignature, uploadToCloudinary, saveCloudinaryVideo } from "@/api/upload";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "djelis", label: "Djelis Videos", icon: Film },
  { value: "donsos", label: "Donsos Interventions", icon: Mic },
  { value: "journalists", label: "Journalists", icon: FileText },
  { value: "other", label: "Other", icon: Play },
] as const;

const TYPES = [
  { value: "video", label: "Video", icon: Film },
  { value: "audio", label: "Audio", icon: Mic },
  { value: "document", label: "Document", icon: FileText },
] as const;

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type MediaEditorProps = {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  token: string;
};

export function MediaEditor({ media, onChange, token }: MediaEditorProps) {
  const list = media.length ? media : [];

  function setAt(i: number, next: MediaItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  async function handleFileUpload(file: File, index: number, type: MediaItem["type"]) {
    try {
      // Use video upload endpoint for video files (supports larger files)
      const res = type === "video" 
        ? await uploadVideoFile(file, token)
        : await uploadFile(file, token);
      setAt(index, { ...list[index], url: res.media.url });
      toast.success("File uploaded");
    } catch {
      toast.error("Upload failed");
    }
  }

  const emptyMedia = (): MediaItem => ({
    url: "",
    title: "",
    type: "video",
    category: "other",
  });

  function titleFromFileName(fileName: string) {
    return fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();
  }

  async function handleBulkVideoUpload(files: File[]) {
    const uploadedItems: MediaItem[] = [];
    let failedCount = 0;
    let lastError = "";

    // Try to get Cloudinary signature for direct upload (bypasses Railway 100MB limit)
    let cloudinarySig = null;
    let useCloudinary = false;
    try {
      cloudinarySig = await getCloudinarySignature(token);
      useCloudinary = true;
      console.log("Using Cloudinary direct upload");
    } catch (err) {
      console.log("Cloudinary not available, using server upload (100MB limit)");
    }

    for (const file of files) {
      // Check file size (100MB for server upload, 100MB for Cloudinary free tier)
      const maxSize = useCloudinary ? 100 * 1024 * 1024 : 90 * 1024 * 1024; // 100MB for Cloudinary, 90MB for Railway
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB > ${maxSize/1024/1024}MB limit)`);
        failedCount += 1;
        continue;
      }

      try {
        let videoUrl: string;

        if (useCloudinary && cloudinarySig) {
          // Upload directly to Cloudinary (bypasses Railway 100MB limit)
          toast.loading(`Uploading ${file.name} to cloud...`, { id: `upload-${file.name}` });
          const cloudResult = await uploadToCloudinary(file, cloudinarySig);
          
          // Save Cloudinary URL to database
          const saveResult = await saveCloudinaryVideo(
            cloudResult.url,
            file.name,
            cloudResult.publicId,
            cloudResult.bytes,
            token
          );
          videoUrl = saveResult.media.url;
          toast.dismiss(`upload-${file.name}`);
        } else {
          // Fallback: Use server upload (limited by Railway 100MB)
          const res = await uploadVideoFile(file, token);
          videoUrl = res.media.url;
        }

        uploadedItems.push({
          url: videoUrl,
          title: titleFromFileName(file.name),
          type: "video",
          category: "other",
        });
      } catch (err: any) {
        failedCount += 1;
        lastError = err?.message || "Unknown error";
        console.error("Video upload failed:", file.name, err);
        toast.dismiss(`upload-${file.name}`);
      }
    }

    if (uploadedItems.length > 0) {
      onChange([...list, ...uploadedItems]);
      toast.success(
        uploadedItems.length === 1 ? "1 video added" : `${uploadedItems.length} videos added`
      );
    }

    if (failedCount > 0) {
      toast.error(
        failedCount === 1 
          ? `1 video failed: ${lastError}` 
          : `${failedCount} videos failed. Last error: ${lastError}`
      );
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-gold/5 to-transparent border border-gold/10">
        <div>
          <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
            <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center">
              <Film className="h-4 w-4 text-black" aria-hidden />
            </div>
            Culture Videos
          </Label>
          <p className="mt-2 text-xs text-muted-foreground max-w-xl">
            Add as many video entries as you want for the public culture page. You can upload them one by one or add several videos at once.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
          onClick={() => onChange([...list, emptyMedia()])}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Video Card
        </Button>
      </div>

      <div className="rounded-xl border border-gold/10 bg-black/15 p-4">
        <Label className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
          Quick Add Multiple Videos
        </Label>
        <p className="mt-2 text-xs text-muted-foreground">
          Select many video files and they will be added to the culture page as separate video cards.
        </p>
        <Input
          type="file"
          accept="video/*"
          multiple
          className="mt-3 border-gold/20 bg-black/20 text-xs"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) void handleBulkVideoUpload(files);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center">
          <Film className="h-8 w-8 text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No culture videos yet. Click <span className="text-gold font-semibold">Add Video Card</span> or use the bulk uploader above.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((item, i) => {
            const TypeIcon = TYPES.find((t) => t.value === item.type)?.icon || Film;
            return (
              <li
                key={i}
                className="relative rounded-lg border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/5 p-3"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {item.url && item.type === "video" ? (
                    <video className="w-20 h-14 rounded object-cover shrink-0" src={item.url} muted />
                  ) : (
                    <div className="w-20 h-14 rounded bg-black/30 flex items-center justify-center shrink-0">
                      <TypeIcon className="h-5 w-5 text-gold/50" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold/70">
                        #{i + 1}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-gold"
                          disabled={i === 0}
                          onClick={() => onChange(moveItem(list, i, i - 1))}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-gold"
                          disabled={i === list.length - 1}
                          onClick={() => onChange(moveItem(list, i, i + 1))}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive/70 hover:text-destructive"
                          onClick={() => onChange(list.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Title Input */}
                    <Input
                      placeholder="Title..."
                      className="h-7 text-xs border-gold/20 bg-black/20 px-2"
                      value={item.title}
                      onChange={(e) => setAt(i, { ...item, title: e.target.value })}
                    />

                    {/* File Input */}
                    {item.url ? (
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-gold/70 truncate flex-1">{item.url.split('/').pop()}</p>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2 py-0 text-muted-foreground hover:text-gold"
                          onClick={() => setAt(i, { ...item, url: "" })}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept={item.type === "video" ? "video/*" : item.type === "audio" ? "audio/*" : ".pdf,.doc,.docx"}
                          className="h-7 text-[10px] border-gold/20 bg-black/20 px-2"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, i, item.type);
                            e.currentTarget.value = "";
                          }}
                        />
                      </div>
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
