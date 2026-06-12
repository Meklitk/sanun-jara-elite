export default function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/60 bg-gold/20" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
    </div>
  );
}
