import { ExternalLink, Map, ZoomIn } from "lucide-react";

import { uploadFile } from "@/api/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminT } from "@/features/admin/admin-i18n";
import { toast } from "sonner";

type Props = {
  mapUrl?: string;
  onChange: (mapUrl: string) => void;
  token: string;
};

export default function AdminFederationMapPanel({ mapUrl, onChange, token }: Props) {
  const at = useAdminT();

  return (
    <section className="space-y-4 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
            <Map className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{at.federationMapTitle}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{at.federationMapDesc}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ZoomIn className="h-3.5 w-3.5" />
              {at.federationMapLightboxHint}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-gold/25 text-xs" asChild>
          <a href="/global-perspectives/country" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            {at.publicPreview}
          </a>
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label className="text-sm text-foreground/90">{at.federationMapUpload}</Label>
        <Input
          type="file"
          accept="image/*"
          className="w-auto max-w-xs text-xs"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const res = await uploadFile(file, token);
              onChange(res.media.url);
              toast.success(at.federationMapUploaded);
            } catch {
              toast.error(at.federationMapUploadFailed);
            }
            e.currentTarget.value = "";
          }}
        />
      </div>

      {mapUrl ? (
        <div className="relative group/map">
          <img
            src={mapUrl}
            alt={at.federationMapTitle}
            className="max-h-72 w-full rounded-xl border border-gold/25 object-contain bg-black/30"
          />
          <button
            type="button"
            className="absolute -right-2 -top-2 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs opacity-0 transition-opacity group-hover/map:opacity-100 hover:bg-red-500/40"
            onClick={() => onChange("")}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-8 text-sm leading-7 text-muted-foreground">
          {at.federationMapEmpty}
        </div>
      )}
    </section>
  );
}
