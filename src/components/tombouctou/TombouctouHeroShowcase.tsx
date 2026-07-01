import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { TombouctouGalleryItem } from "@/api/types";
import type { Lang } from "@/api/types";

type TombouctouHeroShowcaseProps = {
  item: TombouctouGalleryItem;
  lang: Lang;
  onOpen: () => void;
};

function localize(item: TombouctouGalleryItem, field: "title" | "caption" | "altText", lang: Lang) {
  const val = item[field];
  if (!val) return "";
  return (lang === "fr" ? val.fr || val.en : val.en || val.fr) ?? "";
}

export default function TombouctouHeroShowcase({ item, lang, onOpen }: TombouctouHeroShowcaseProps) {
  const alt = localize(item, "altText", lang) || "";
  const [kenBurns, setKenBurns] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setKenBurns(true), 100);
    return () => clearTimeout(timer);
  }, [item._id]);

  return (
    <section className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onClick={onOpen}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] border border-gold/15 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:rounded-[2rem]"
        aria-label="View image"
      >
        <div className="relative aspect-[21/9] min-h-[240px] overflow-hidden sm:min-h-[320px] md:min-h-[420px]">
          <div
            className={`absolute inset-[-8%] transition-transform ease-linear ${
              kenBurns ? "scale-110" : "scale-100"
            }`}
            style={{ transitionDuration: "20000ms" }}
          >
            <img
              src={item.url}
              alt={alt}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.45)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/30" />

          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(212,160,23,0.08)]" />
          </div>
        </div>
      </motion.button>
    </section>
  );
}
