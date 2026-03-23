import { useI18n } from "@/lib/i18n";
import { useNavigate, useLocation } from "react-router-dom";

const topNavItems = [
  { key: "globalPerspectives" as const, path: "/global-perspectives" },
  { key: "referenceBureau" as const, path: "/reference-bureau" },
  { key: "academy" as const, path: "/academy" },
  { key: "intranet" as const, path: "/intranet" },
];

export default function TopBar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-14 glass-panel border-b border-border flex items-center px-8">
      <nav className="flex items-center gap-8">
        {topNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`text-xs font-display uppercase tracking-[0.15em] transition-colors duration-300 ${
                isActive
                  ? "text-gold"
                  : "text-muted-foreground hover:text-gold"
              }`}
            >
              {t[item.key]}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
