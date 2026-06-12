import { useEffect, useState } from "react";
import {
  deleteFederationRegion,
  listFederationRegions,
  uploadFederationRegion,
} from "@/api/federation-regions";
import { FEDERATION_REGIONS, type FederationRegionCode } from "@/data/federation-regions";
import FederationRegionTile from "@/components/FederationRegionTile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminT } from "@/features/admin/admin-i18n";
import { toast } from "sonner";
import { CheckCircle2, ImagePlus, Trash2 } from "lucide-react";

type Props = {
  token: string;
};

export default function AdminFederationRegionsPanel({ token }: Props) {
  const at = useAdminT();
  const [customImages, setCustomImages] = useState<Record<string, boolean>>({});
  const [uploadingCode, setUploadingCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  async function refresh() {
    try {
      const res = await listFederationRegions();
      setCustomImages(res.regions ?? {});
    } catch {
      setCustomImages({});
    }
  }

  useEffect(() => {
    void refresh();
  }, [token]);

  async function onUpload(code: FederationRegionCode, file: File | undefined) {
    if (!file) return;
    setUploadingCode(code);
    try {
      await uploadFederationRegion(file, code, token);
      setCustomImages((current) => ({ ...current, [code]: true }));
      toast.success(`${code} — ${at.federationRegionUploaded}`);
      await refresh();
    } catch {
      toast.error(at.federationRegionUploadFailed);
    } finally {
      setUploadingCode(null);
    }
  }

  async function onDelete(code: FederationRegionCode) {
    if (!window.confirm(at.federationRegionDeleteConfirm)) return;

    setDeletingCode(code);
    try {
      await deleteFederationRegion(code, token);
      setCustomImages((current) => ({ ...current, [code]: false }));
      toast.success(at.federationRegionDeleted);
      await refresh();
    } catch {
      toast.error(at.federationRegionDeleteFailed);
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-gold/20 bg-black/20 p-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">{at.federationRegionsTitle}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{at.federationRegionsDesc}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FEDERATION_REGIONS.map((region) => {
          const hasCustom = customImages[region.code];
          const busy = uploadingCode === region.code || deletingCode === region.code;
          const url = `/images/maps/regions/${region.filename}`;

          return (
            <div
              key={region.code}
              className={`rounded-lg border p-3 ${
                hasCustom ? "border-green-500/25 bg-green-500/5" : "border-gold/12 bg-black/20"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-lg font-bold text-gold">{region.code}</p>
                <span className="font-display text-xl text-gold/80">{region.nkoChar}</span>
              </div>

              <div className="relative group/region mt-2 flex h-20 items-center justify-center overflow-hidden rounded-md border border-gold/10 bg-black/30">
                {hasCustom ? (
                  <>
                    <img
                      src={`${url}?t=${Date.now()}`}
                      alt={region.code}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      disabled={busy}
                      title={at.delete}
                      className="absolute right-1.5 top-1.5 rounded-md border border-red-500/30 bg-red-500/20 p-1 text-red-200 opacity-0 transition-opacity hover:bg-red-500/40 group-hover/region:opacity-100 disabled:opacity-40"
                      onClick={() => void onDelete(region.code)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <FederationRegionTile
                    code={region.code}
                    nkoChar={region.nkoChar}
                    compact
                    className="h-full w-full border-0 shadow-none"
                  />
                )}
              </div>

              <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                {hasCustom ? at.federationRegionCustomHint : at.federationRegionDefaultHint}
              </p>

              <Input
                type="file"
                accept="image/*"
                disabled={busy}
                className="mt-2 text-xs"
                onChange={(e) => {
                  void onUpload(region.code, e.target.files?.[0]);
                  e.currentTarget.value = "";
                }}
              />
              {hasCustom ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  className="mt-1 h-7 px-2 text-[10px] text-red-300 hover:bg-red-500/10 hover:text-red-200"
                  onClick={() => void onDelete(region.code)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  {at.delete}
                </Button>
              ) : null}
              {busy ? (
                <p className="mt-1 text-[10px] text-muted-foreground">{at.bioUploading}</p>
              ) : hasCustom ? (
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  {at.bioOnline}
                </p>
              ) : (
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-gold/70">
                  <ImagePlus className="h-3 w-3" />
                  {at.federationRegionOptionalUpload}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
