import { useEffect, useState } from "react";
import { MapPin, ZoomIn } from "lucide-react";

import ImageLightbox from "@/components/ImageLightbox";
import { DEFAULT_FEDERATION_MAP } from "@/lib/federation-map";
import { useI18n } from "@/lib/i18n";

type MandenFederationMapProps = {
  mapSrc?: string;
};

const MAP_LABELS = {
  en: [
    "Djoliba (Niger River)",
    "Sankarani River through Niani",
    "Selengue dam on the Sankarani",
    "Niani · Tombouctou · Hamana · Banantou · Bambalata",
    "Modern Mali, Guinea, and Senegal shapes — without country names",
  ],
  fr: [
    "Djoliba (fleuve Niger)",
    "Fleuve Sankarani traversant Niani",
    "Barrage de Selengue sur le Sankarani",
    "Niani · Tombouctou · Hamana · Banantou · Bambalata",
    "Formes du Mali, de la Guinée et du Sénégal — sans noms de pays",
  ],
};

export default function MandenFederationMap({ mapSrc }: MandenFederationMapProps) {
  const { lang } = useI18n();
  const [activeSrc, setActiveSrc] = useState(mapSrc?.trim() || DEFAULT_FEDERATION_MAP);
  const [failed, setFailed] = useState(false);
  const labels = lang === "fr" ? MAP_LABELS.fr : MAP_LABELS.en;

  useEffect(() => {
    setActiveSrc(mapSrc?.trim() || DEFAULT_FEDERATION_MAP);
    setFailed(false);
  }, [mapSrc]);

  function handleError() {
    if (activeSrc !== DEFAULT_FEDERATION_MAP) {
      setActiveSrc(DEFAULT_FEDERATION_MAP);
      return;
    }
    setFailed(true);
  }

  if (failed) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-gold/25 bg-black/20 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {lang === "fr" ? "Carte médiévale du Manden" : "Medieval map of Manden"}
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              {lang === "fr"
                ? "Téléversez la carte dans Admin → Perspectives Globales, ou ajoutez public/images/maps/manden-federation-map.jpg"
                : "Upload the map in Admin → Global Perspectives, or add public/images/maps/manden-federation-map.jpg"}
            </p>
            <ul className="space-y-1.5 text-xs leading-6 text-foreground/70">
              {labels.map((label) => (
                <li key={label} className="flex gap-2">
                  <span className="text-gold">•</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">
          {lang === "fr" ? "Carte de la Fédération" : "Federation map"}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ZoomIn className="h-3.5 w-3.5" />
          {lang === "fr" ? "Cliquez pour agrandir" : "Click to enlarge"}
        </span>
      </div>
      <ImageLightbox
        src={activeSrc}
        alt={lang === "fr" ? "Carte médiévale du Manden" : "Medieval map of Manden"}
        className="w-full rounded-[1.25rem] border border-gold/15 object-contain bg-black/30"
        onError={handleError}
      />
    </div>
  );
}
