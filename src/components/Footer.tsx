import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 text-center">
      <p className="text-[11px] tracking-[0.15em] text-gold/50 flex items-center justify-center gap-1.5">
        <span>by Meklit</span>
        <Heart className="h-3 w-3 text-gold/40 fill-gold/20" />
        <span>with love</span>
      </p>
    </footer>
  );
}
