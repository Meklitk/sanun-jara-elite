import { useI18n } from "@/lib/i18n";

export default function TopBar() {
  const { t } = useI18n();

  const topItems = [
    t.globalPerspectives,
    t.referenceBureau,
    t.academy,
    t.intranet,
  ];

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-14 glass-panel border-b border-border flex items-center px-8">
      <nav className="flex items-center gap-8">
        {topItems.map((item) => (
          <button
            key={item}
            className="text-xs font-display uppercase tracking-[0.15em] text-muted-foreground hover:text-gold transition-colors duration-300"
          >
            {item} ▾
          </button>
        ))}
      </nav>
    </header>
  );
}
