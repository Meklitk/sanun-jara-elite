import { useEffect, useState } from "react";
import { ExternalLink, ImagePlus, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

import { deleteCardImage, listCardImages, uploadCardImage } from "@/api/card-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAdmin, useAdminT } from "@/features/admin/admin-i18n";
import { useI18n } from "@/lib/i18n";
import {
  CARD_IMAGE_SLOTS,
  CARD_IMAGES,
  type CardImageKey,
  type CardImageSlot,
} from "@/lib/card-images";
import { toast } from "sonner";

type Props = {
  section: CardImageSlot["section"];
  slots: CardImageKey[];
  token: string;
  previewPath?: string;
};

export default function AdminCardImagesPanel({ section: _section, slots, token, previewPath }: Props) {
  const at = useAdminT();
  const { lang } = useI18n();
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<string | null>(null);

  async function refresh() {
    try {
      const res = await listCardImages();
      setUploaded(res.files ?? {});
    } catch {
      setUploaded({});
    }
  }

  useEffect(() => {
    void refresh();
  }, [token]);

  async function onUpload(slot: CardImageKey, file: File | undefined) {
    if (!file) return;
    setUploadingSlot(slot);
    try {
      await uploadCardImage(file, slot, token);
      setUploaded((current) => ({ ...current, [slot]: true }));
      toast.success(formatAdmin(at.cardImageUploaded, { label: CARD_IMAGE_SLOTS[slot].labelEn }));
      await refresh();
    } catch {
      toast.error(at.cardImageUploadFailed);
    } finally {
      setUploadingSlot(null);
    }
  }

  async function onDelete(slot: CardImageKey) {
    const meta = CARD_IMAGE_SLOTS[slot];
    const label = lang === "fr" ? meta.labelFr : meta.labelEn;
    if (!window.confirm(at.cardImageDeleteConfirm)) return;

    setDeletingSlot(slot);
    try {
      await deleteCardImage(slot, token);
      setUploaded((current) => ({ ...current, [slot]: false }));
      toast.success(formatAdmin(at.cardImageDeleted, { label }));
      await refresh();
    } catch {
      toast.error(at.cardImageDeleteFailed);
    } finally {
      setDeletingSlot(null);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{at.cardImagesTitle}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{at.cardImagesDesc}</p>
        </div>
        {previewPath ? (
          <Button variant="outline" size="sm" className="border-gold/25 text-xs" asChild>
            <a href={previewPath} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              {at.publicPreview}
            </a>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {slots.map((slot) => {
          const meta = CARD_IMAGE_SLOTS[slot];
          const url = CARD_IMAGES[slot];
          const exists = uploaded[slot];
          const busy = uploadingSlot === slot || deletingSlot === slot;
          const label = lang === "fr" ? meta.labelFr : meta.labelEn;
          const hint = lang === "fr" ? meta.hintFr : meta.hintEn;

          return (
            <div
              key={slot}
              className={`rounded-xl border p-4 ${
                exists ? "border-green-500/25 bg-green-500/5" : "border-white/8 bg-black/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
                </div>
                {exists ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {at.bioOnline}
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {at.bioMissing}
                  </span>
                )}
              </div>

              <div className="relative group/card mt-3 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-gold/15 bg-black/30">
                {exists ? (
                  <>
                    <img src={`${url}?t=${Date.now()}`} alt={label} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      disabled={busy}
                      title={at.delete}
                      className="absolute right-2 top-2 rounded-md border border-red-500/30 bg-red-500/20 p-1.5 text-red-200 opacity-0 transition-opacity hover:bg-red-500/40 group-hover/card:opacity-100 disabled:opacity-40"
                      onClick={() => void onDelete(slot)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <ImagePlus className="h-8 w-8 text-gold/40" />
                )}
              </div>

              <p className="mt-2 font-mono text-[10px] text-foreground/60">{meta.filename}</p>

              <Input
                type="file"
                accept="image/*"
                disabled={busy}
                className="mt-3 text-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  void onUpload(slot, file);
                  e.currentTarget.value = "";
                }}
              />
              <p className="mt-1 text-[10px] text-muted-foreground">{at.cardImageUploadHint}</p>
              {busy ? (
                <p className="mt-1 text-[10px] text-muted-foreground">{at.bioUploading}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
