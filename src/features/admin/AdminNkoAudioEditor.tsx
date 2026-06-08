import { NKO_ALPHABET } from "@/features/academy/nko-alphabet";
import { uploadFile } from "@/api/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Volume2, X } from "lucide-react";

type Props = {
  audioUrls: string[];
  onChange: (audioUrls: string[]) => void;
  token: string;
};

function normalizeAudioUrls(urls: string[] | undefined) {
  return Array.from({ length: NKO_ALPHABET.length }, (_, index) => urls?.[index] ?? "");
}

export default function AdminNkoAudioEditor({ audioUrls, onChange, token }: Props) {
  const urls = normalizeAudioUrls(audioUrls);

  async function onUpload(index: number, file: File) {
    if (!file.type.startsWith("audio/") && !file.name.toLowerCase().endsWith(".mp3")) {
      toast.error("Please upload an MP3 or audio file");
      return;
    }

    try {
      const res = await uploadFile(file, token);
      const next = [...urls];
      next[index] = res.media.url;
      onChange(next);
      toast.success(`Audio uploaded for ${NKO_ALPHABET[index].char}`);
    } catch {
      toast.error("Failed to upload audio");
    }
  }

  function clearAudio(index: number) {
    const next = [...urls];
    next[index] = "";
    onChange(next);
  }

  const uploadedCount = urls.filter(Boolean).length;

  return (
    <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5 space-y-4">
      <div>
        <Label className="text-gold">N&apos;Ko Lesson 1 — Alphabet Audio</Label>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload one MP3 per letter ({uploadedCount}/{NKO_ALPHABET.length} uploaded). These play on the public page at{" "}
          <span className="text-gold">/academy/nko</span> — not via the Windows folder in your browser.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NKO_ALPHABET.map((letter, index) => (
          <div
            key={letter.char}
            className="flex items-center gap-3 rounded-xl border border-gold/15 bg-black/20 p-3"
          >
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
              <span className="text-xl text-gold">{letter.char}</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{letter.romanization}</span>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              {urls[index] ? (
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <Volume2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Audio ready</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No audio yet</p>
              )}

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="audio/*,.mp3"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void onUpload(index, file);
                      event.target.value = "";
                    }}
                  />
                  <Button type="button" size="sm" variant="outline" className="border-gold/30" asChild>
                    <span>
                      <Upload className="mr-1 h-3.5 w-3.5" />
                      Upload
                    </span>
                  </Button>
                </label>
                {urls[index] ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => clearAudio(index)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
