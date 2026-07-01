import { motion } from "framer-motion";

import type { TombouctouGalleryItem, TombouctouGallerySize } from "@/api/types";
import type { Lang } from "@/api/types";
import { cn } from "@/lib/utils";
import LazyGalleryImage from "./LazyGalleryImage";

type TombouctouMasonryGalleryProps = {
  items: TombouctouGalleryItem[];
  lang: Lang;
  sectionTitle: string;
  onImageClick: (itemId: string) => void;
};

const SIZE_CLASSES: Record<TombouctouGallerySize, string> = {
  small: "row-span-1",
  medium: "row-span-2",
  large: "row-span-3",
  tall: "row-span-4",
  wide: "row-span-2 sm:col-span-2",
};

function localize(item: TombouctouGalleryItem, field: "title" | "caption" | "altText", lang: Lang) {
  const val = item[field];
  if (!val) return "";
  return (lang === "fr" ? val.fr || val.en : val.en || val.fr) ?? "";
}

export default function TombouctouMasonryGallery({
  items,
  lang,
  sectionTitle,
  onImageClick,
}: TombouctouMasonryGalleryProps) {
  if (items.length === 0) return null;

  return (
    <section className="relative py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-8 text-center"
      >
        <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[#D4A017]">
          {sectionTitle}
        </h2>
        <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </motion.div>

      <div className="mx-auto grid max-w-7xl auto-rows-[120px] grid-cols-1 gap-3 px-3 sm:auto-rows-[140px] sm:grid-cols-2 sm:gap-4 sm:px-4 md:grid-cols-3 lg:gap-5 lg:px-6">
        {items.map((item, i) => {
          const alt = localize(item, "altText", lang);
          const sizeClass = SIZE_CLASSES[item.size] ?? SIZE_CLASSES.medium;

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                delay: (i % 9) * 0.05,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-gold/12 bg-black/25 shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition duration-500 hover:border-gold/28 hover:shadow-[0_20px_60px_rgba(212,160,23,0.08)]",
                sizeClass
              )}
            >
              <LazyGalleryImage
                src={item.url}
                alt={alt}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                onClick={() => onImageClick(item._id)}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
