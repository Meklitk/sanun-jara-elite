import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useTombouctouGallery } from "@/api/tombouctou-gallery";
import type { TombouctouGalleryItem } from "@/api/types";
import { useI18n } from "@/lib/i18n";

import GoldParticles from "./GoldParticles";
import TombouctouHeroShowcase from "./TombouctouHeroShowcase";
import TombouctouLightbox from "./TombouctouLightbox";
import TombouctouMasonryGallery from "./TombouctouMasonryGallery";
import TombouctouTimeline from "./TombouctouTimeline";

function splitGalleryItems(items: TombouctouGalleryItem[]) {
  const featured = items.find((i) => i.isFeatured) ?? items[0];
  const rest = items.filter((i) => i._id !== featured?._id);
  const timelineCount = Math.min(Math.ceil(rest.length / 2), 12);
  const timeline = rest.slice(0, timelineCount);
  const masonry = rest.slice(timelineCount);
  return { featured, timeline, masonry, all: items };
}

export default function TombouctouGallery() {
  const { lang, t } = useI18n();
  const { data, isLoading } = useTombouctouGallery();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = data?.items ?? [];

  const { featured, timeline, masonry, all } = useMemo(
    () => splitGalleryItems(items),
    [items]
  );

  if (isLoading) {
    return (
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl space-y-6 px-4">
          <div className="aspect-[21/9] animate-pulse rounded-[2rem] bg-gold/5" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-gold/5" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const featuredGlobalIndex = featured ? all.findIndex((i) => i._id === featured._id) : 0;

  const openLightbox = (itemId: string) => {
    const idx = all.findIndex((i) => i._id === itemId);
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <GoldParticles count={20} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-[1] space-y-4 sm:space-y-8"
      >
        {featured && (
          <TombouctouHeroShowcase
            item={featured}
            lang={lang}
            onOpen={() => setLightboxIndex(featuredGlobalIndex)}
          />
        )}

        {timeline.length > 0 && (
          <TombouctouTimeline
            items={timeline}
            lang={lang}
            sectionTitle={t.tombouctouGalleryTimeline}
            onImageClick={openLightbox}
          />
        )}

        {masonry.length > 0 && (
          <TombouctouMasonryGallery
            items={masonry}
            lang={lang}
            sectionTitle={t.tombouctouGalleryCollection}
            onImageClick={openLightbox}
          />
        )}
      </motion.div>

      {lightboxIndex !== null && (
        <TombouctouLightbox
          items={all}
          initialIndex={lightboxIndex}
          lang={lang}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
