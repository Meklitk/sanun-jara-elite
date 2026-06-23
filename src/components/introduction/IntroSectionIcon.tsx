import { cn } from "@/lib/utils";

type IntroSectionIconProps = {
  src: string;
  alt: string;
  size?: "card" | "header";
  className?: string;
};

export function IntroSectionIcon({ src, alt, size = "card", className }: IntroSectionIconProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gold/25 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),rgba(0,0,0,0.85))] shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
        size === "card" ? "h-14 w-14 p-2 sm:h-16 sm:w-16 sm:p-2.5" : "h-24 w-24 p-3",
        className
      )}
    >
      <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" />
    </div>
  );
}
