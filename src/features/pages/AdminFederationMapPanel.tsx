import { ExternalLink, Map, ZoomIn, Upload, RotateCcw } from "lucide-react";

import { uploadFile } from "@/api/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminT } from "@/features/admin/admin-i18n";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type Props = {
  mapUrl?: string;
  onChange: (mapUrl: string) => void;
  hoverImages?: string[];
  onChangeHoverImages: (images: string[]) => void;
  token: string;
};

const DEFAULT_FALLBACKS = [
  "/images/maps/hamana-thumbnail.png",
  "/images/maps/niani-thumbnail.png",
  "/images/maps/tombouctou-thumbnail.png",
];

const CITIES = [
  { id: "hamana", name: { en: "Hamana", fr: "Hamana" } },
  { id: "niani", name: { en: "Niani", fr: "Niani" } },
  { id: "tombouctou", name: { en: "Tombouctou", fr: "Tombouctou" } },
];

export default function AdminFederationMapPanel({
  mapUrl,
  onChange,
  hoverImages = [],
  onChangeHoverImages,
  token,
}: Props) {
  const at = useAdminT();
  const { lang } = useI18n();

  // Helper to update a specific image in the array
  function handleImageUpload(index: number, url: string) {
    const nextImages = [...hoverImages];
    // Pad the array to ensure we can set the index
    while (nextImages.length <= index) {
      nextImages.push("");
    }
    nextImages[index] = url;
    onChangeHoverImages(nextImages);
  }

  function handleResetImage(index: number) {
    const nextImages = [...hoverImages];
    if (index < nextImages.length) {
      nextImages[index] = "";
      onChangeHoverImages(nextImages);
    }
  }

  return (
    <div className="space-y-6">
      {/* ─── MAP BASELINE PANEL ─── */}
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

      {/* ─── HOTSPOT HOVER IMAGES PANEL ─── */}
      <section className="space-y-4 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {lang === "fr" ? "Images de survol des villes" : "City Hover Images"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-5">
            {lang === "fr"
              ? "Téléversez des images personnalisées pour les fenêtres au survol de la carte (Hamana, Niani, Tombouctou). Sinon, les illustrations par défaut seront utilisées."
              : "Upload custom images to display in the hover popups for each city on the map. If left empty, default illustrations will be used."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {CITIES.map((city, index) => {
            const customUrl = hoverImages[index];
            const fallbackUrl = DEFAULT_FALLBACKS[index];
            const displayUrl = customUrl || fallbackUrl;
            const cityName = lang === "fr" ? city.name.fr : city.name.en;

            return (
              <div
                key={city.id}
                className="flex flex-col rounded-lg border border-gold/15 bg-black/25 p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gold tracking-wide">{cityName}</span>
                  {customUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-gold"
                      onClick={() => handleResetImage(index)}
                      title={lang === "fr" ? "Réinitialiser" : "Reset to default"}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-gold/10 bg-black/20">
                  <img
                    src={displayUrl}
                    alt={cityName}
                    className="h-full w-full object-cover"
                  />
                  {!customUrl && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-semibold bg-black/60 text-gold/80 border border-gold/10">
                      {lang === "fr" ? "Défaut" : "Default"}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-1.5 justify-center px-3 py-1.5 w-full rounded-md border border-gold/20 hover:border-gold/45 hover:bg-gold/5 text-xs text-foreground cursor-pointer transition-all duration-200">
                    <Upload className="h-3.5 w-3.5 text-gold/80" />
                    <span>{lang === "fr" ? "Changer" : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await uploadFile(file, token);
                          handleImageUpload(index, res.media.url);
                          toast.success(
                            lang === "fr"
                              ? `Image pour ${cityName} téléversée`
                              : `Image for ${cityName} uploaded`
                          );
                        } catch {
                          toast.error(
                            lang === "fr"
                              ? "Échec du téléversement"
                              : "Upload failed"
                          );
                        }
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
