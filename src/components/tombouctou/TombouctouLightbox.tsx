import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { TombouctouGalleryItem } from "@/api/types";
import type { Lang } from "@/api/types";

type TombouctouLightboxProps = {
  items: TombouctouGalleryItem[];
  initialIndex: number;
  lang: Lang;
  onClose: () => void;
};

function localize(item: TombouctouGalleryItem, field: "title" | "caption" | "altText", lang: Lang) {
  const val = item[field];
  if (!val) return "";
  return (lang === "fr" ? val.fr || val.en : val.en || val.fr) ?? "";
}

export default function TombouctouLightbox({
  items,
  initialIndex,
  lang,
  onClose,
}: TombouctouLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const current = items[index];
  const alt = current ? localize(current, "altText", lang) : "";

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  }, [items.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function onTouchEnd() {
    if (touchDeltaX.current > 60) goPrev();
    else if (touchDeltaX.current < -60) goNext();
  }

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/97 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Gallery viewer"
        onClick={onClose}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]"
          aria-hidden
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-gold/25 bg-black/60 p-2 text-gold/80 transition hover:border-gold/50 hover:text-gold sm:right-6 sm:top-6"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gold/20 bg-black/50 p-2 text-gold/70 transition hover:border-gold/40 hover:text-gold sm:left-4 sm:p-3"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gold/20 bg-black/50 p-2 text-gold/70 transition hover:border-gold/40 hover:text-gold sm:right-4 sm:p-3"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <motion.div
          key={current._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[1] mx-4 flex max-h-[90vh] max-w-6xl flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="overflow-hidden rounded-2xl border border-gold/20 shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_60px_rgba(212,160,23,0.06)]">
            <img
              src={current.url}
              alt={alt}
              className="max-h-[75vh] w-auto max-w-full object-contain"
            />
          </div>

          {items.length > 1 && (
            <p className="mt-3 text-xs tracking-widest text-gold/50">
              {index + 1} / {items.length}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
