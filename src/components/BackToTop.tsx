import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t.footerBackToTop}
      className={cn(
        "fixed bottom-24 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A017]/40 bg-black/80 text-[#D4A017] shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(212,160,23,0.15)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A017]/70 hover:bg-[#D4A017]/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(212,160,23,0.25)] sm:bottom-28 sm:right-6",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
