import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAdminT } from "./admin-i18n";

export default function AdminLanguageToggle() {
  const { lang, setLang } = useI18n();
  const at = useAdminT();

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{at.adminLanguage}</p>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setLang("fr")}
          className={cn(
            "rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
            lang === "fr"
              ? "gold-gradient-bg text-black"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          FR
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={cn(
            "rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
            lang === "en"
              ? "gold-gradient-bg text-black"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}
