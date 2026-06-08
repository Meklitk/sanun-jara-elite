import { Heart, Facebook } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto py-8 text-center space-y-4">
      <div className="flex items-center justify-center gap-4">
        <a
          href="https://www.facebook.com/profile.php?id=61555027864138"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-gold/15 bg-black/20 px-4 py-2 text-sm text-foreground/70 transition hover:border-gold/30 hover:text-gold"
        >
          <Facebook className="h-4 w-4" />
          <span>{t.facebook}</span>
        </a>
      </div>
      <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-gold/35 transition-colors hover:text-gold/60">
        <span>Made by Meklit</span>
        <Heart className="h-2.5 w-2.5 fill-gold/25 text-gold/40" />
        <span>with love</span>
      </p>
    </footer>
  );
}
