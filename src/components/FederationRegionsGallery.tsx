import { useEffect, useState } from "react";

import ImageLightbox from "@/components/ImageLightbox";
import FederationRegionTile from "@/components/FederationRegionTile";
import { listFederationRegions } from "@/api/federation-regions";
import { FEDERATION_REGIONS } from "@/data/federation-regions";
import { useI18n } from "@/lib/i18n";

export default function FederationRegionsGallery() {
  const { lang } = useI18n();
  const [customImages, setCustomImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    listFederationRegions()
      .then((res) => setCustomImages(res.regions ?? {}))
      .catch(() => setCustomImages({}));
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">
        {lang === "fr" ? "Régions de la Fédération" : "Federation regions"}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {FEDERATION_REGIONS.map((region) => {
          const url = `/images/maps/regions/${region.filename}`;
          const hasCustomImage = customImages[region.code];

          return (
            <div key={region.code} className="space-y-2">
              {hasCustomImage ? (
                <ImageLightbox
                  src={url}
                  alt={region.code}
                  className="aspect-square w-full rounded-xl border border-gold/15 object-cover"
                />
              ) : (
                <FederationRegionTile code={region.code} nkoChar={region.nkoChar} className="aspect-square w-full" />
              )}
              {!hasCustomImage ? null : (
                <p className="text-center font-display text-sm font-bold tracking-wider text-gold">{region.code}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
