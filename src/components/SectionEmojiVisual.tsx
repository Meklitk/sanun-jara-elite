import { cn } from "@/lib/utils";

type SectionEmojiVisualProps = {
  emoji?: string;
  imageSrc?: string;
  imageAlt?: string;
  size?: "header" | "card";
  className?: string;
};

export function SectionEmojiVisual({
  emoji,
  imageSrc,
  imageAlt = "",
  size = "header",
  className,
}: SectionEmojiVisualProps) {
  const glyphCount = [...(emoji ?? "")].length;
  const isWide = glyphCount > 2;

  const sizeClasses =
    size === "header"
      ? isWide
        ? "min-h-20 min-w-[6.5rem] gap-1 px-3 text-4xl sm:min-h-24 sm:min-w-[7.5rem] sm:text-5xl"
        : "h-20 w-20 text-5xl sm:h-24 sm:w-24 sm:text-6xl"
      : isWide
        ? "mb-4 sm:mb-6 min-h-16 min-w-[5.5rem] gap-1 px-2 text-3xl sm:min-h-[4.5rem] sm:min-w-[6.5rem] sm:text-4xl"
        : "mb-4 sm:mb-6 h-16 w-16 text-4xl sm:h-[4.5rem] sm:w-[4.5rem] sm:text-5xl";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gold/30 bg-gold/10 leading-none shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
        sizeClasses,
        className
      )}
      aria-hidden={imageSrc ? undefined : true}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        emoji
      )}
    </div>
  );
}
