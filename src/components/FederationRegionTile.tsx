import { cn } from "@/lib/utils";

type FederationRegionTileProps = {
  code: string;
  nkoChar: string;
  className?: string;
  compact?: boolean;
};

export default function FederationRegionTile({
  code,
  nkoChar,
  className,
  compact = false,
}: FederationRegionTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-gold/15 bg-black/30 shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
        compact ? "p-3" : "p-4 sm:p-5",
        className,
      )}
    >
      <span className={cn("font-display text-gold", compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl")}>
        {nkoChar}
      </span>
      <span className="mt-2 font-display text-sm font-bold tracking-wider text-gold/90">{code}</span>
    </div>
  );
}
