import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { TombouctouGalleryItem } from "@/api/types";
import type { Lang } from "@/api/types";
import LazyGalleryImage from "./LazyGalleryImage";

type TombouctouTimelineProps = {
  items: TombouctouGalleryItem[];
  lang: Lang;
  sectionTitle: string;
  onImageClick: (itemId: string) => void;
};

function localize(item: TombouctouGalleryItem, field: "title" | "caption" | "altText", lang: Lang) {
  const val = item[field];
  if (!val) return "";
  return (lang === "fr" ? val.fr || val.en : val.en || val.fr) ?? "";
}

export default function TombouctouTimeline({
  items,
  lang,
  sectionTitle,
  onImageClick,
}: TombouctouTimelineProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  if (items.length === 0) return null;

  return (
    <section ref={ref} className="relative py-8 sm:py-12">
      <motion.div style={{ y: parallaxY }} className="mb-8 text-center">
        <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[#D4A017]">
          {sectionTitle}
        </h2>
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </motion.div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#050505] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#050505] to-transparent sm:w-16" />

        <div className="flex gap-4 overflow-x-auto px-3 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold/20 sm:gap-5 sm:px-6 md:gap-6">
          {items.map((item, i) => {
            const alt = localize(item, "altText", lang);

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: (i % 8) * 0.06,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group shrink-0"
              >
                <div className="w-[220px] overflow-hidden rounded-2xl border border-gold/12 bg-black/30 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition duration-500 hover:border-gold/30 hover:shadow-[0_24px_70px_rgba(212,160,23,0.1)] sm:w-[280px] md:w-[320px]">
                  <div className="overflow-hidden">
                    <LazyGalleryImage
                      src={item.url}
                      alt={alt}
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                      onClick={() => onImageClick(item._id)}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
