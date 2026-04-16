import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto py-8 text-center">
      <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-gold/35 transition-colors hover:text-gold/60">
        <span>Made by Meklit</span>
        <Heart className="h-2.5 w-2.5 fill-gold/25 text-gold/40" />
        <span>with love</span>
      </p>
    </footer>
  );
}
