import { Coins } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useI18n } from "@/lib/i18n";

const hiddenOnPaths = ["/bureau/cotiser", "/reference-bureau/cotiser"];

export default function CotiserCta() {
  const { t } = useI18n();
  const location = useLocation();

  if (hiddenOnPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <Link
      to="/bureau/cotiser"
      className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/90 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-black shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition hover:bg-gold sm:bottom-6 sm:right-6 sm:px-5 sm:text-sm"
    >
      <Coins className="h-4 w-4" />
      <span>{t.iAmEntrepreneur}</span>
    </Link>
  );
}
