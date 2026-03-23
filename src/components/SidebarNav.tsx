import { useI18n } from "@/lib/i18n";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

const navItems = [
  { key: "introduction" as const, path: "/" },
  { key: "history" as const, path: "/history" },
  { key: "governance" as const, path: "/governance" },
  { key: "economy" as const, path: "/economy" },
  { key: "commerce" as const, path: "/commerce" },
  { key: "culture" as const, path: "/culture" },
  { key: "resources" as const, path: "/resources" },
];

export default function SidebarNav() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass-panel border-r border-border flex flex-col">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Sanunjara" className="h-10 w-10 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-lg font-bold gold-gradient-text leading-tight">
            Sanunjara
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Manden Empire
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.key}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left px-4 py-3 rounded-lg font-display text-sm tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-primary/20 text-gold border-l-2 border-gold"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {t[item.key]}
            </motion.button>
          );
        })}
      </nav>

      {/* Language Switcher */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex gap-2">
          <button
            onClick={() => setLang("en")}
            className={`flex-1 py-2 rounded-md text-xs font-display uppercase tracking-wider transition-all ${
              lang === "en"
                ? "gold-gradient-bg text-secondary-foreground font-semibold"
                : "glass-panel text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`flex-1 py-2 rounded-md text-xs font-display uppercase tracking-wider transition-all ${
              lang === "fr"
                ? "gold-gradient-bg text-secondary-foreground font-semibold"
                : "glass-panel text-muted-foreground hover:text-foreground"
            }`}
          >
            FR
          </button>
        </div>
      </div>
    </aside>
  );
}
