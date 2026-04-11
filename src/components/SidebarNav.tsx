import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { buildQuickNavItems, coreNavItems, utilityNavItems } from "@/lib/site-config";

type SidebarNavProps = {
  mode?: "desktop" | "mobile";
  includeUtilityNav?: boolean;
  onNavigate?: () => void;
};

export default function SidebarNav({
  mode = "desktop",
  includeUtilityNav = false,
  onNavigate,
}: SidebarNavProps) {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const searchItems = buildQuickNavItems(t);
  const trimmedQuery = deferredQuery.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? searchItems
        .filter((item) => {
          const haystack = `${item.parentLabel} ${item.label}`.toLowerCase();
          return haystack.includes(trimmedQuery);
        })
        .slice(0, 7)
    : [];

  function goTo(path: string) {
    navigate(path);
    setQuery("");
    setSearchActive(false);
    onNavigate?.();
  }

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <aside
      className={cn(
        "flex flex-col gap-6",
        mode === "desktop"
          ? "sticky top-24 hidden h-[calc(100vh-7rem)] w-[244px] shrink-0 rounded-[1.75rem] border border-gold/15 bg-black/30 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.32)] lg:flex"
          : "h-full rounded-none border-none bg-transparent p-0 shadow-none",
      )}
    >
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold/65">
          {t.search}
        </p>
        <div className="relative">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (searchResults[0]) {
                goTo(searchResults[0].path);
              }
            }}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchActive(true)}
              onBlur={() => {
                window.setTimeout(() => setSearchActive(false), 120);
              }}
              placeholder={t.quickSearchPlaceholder}
              className="h-11 rounded-xl border-gold/15 bg-black/35 pl-10 text-sm text-foreground placeholder:text-muted-foreground/80 focus-visible:ring-gold/40"
            />
          </form>

          {searchActive && (trimmedQuery || searchResults.length > 0) ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-30 overflow-hidden rounded-2xl border border-gold/15 bg-background/95 p-2 shadow-[0_26px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={() => goTo(item.path)}
                      className="flex w-full items-start gap-2 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
                    >
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-gold/65" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        {item.parentLabel ? (
                          <div className="mt-0.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            {item.parentLabel}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl px-3 py-4 text-sm text-muted-foreground">{t.noResults}</div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {includeUtilityNav ? (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold/65">
            {t.overview}
          </p>
          <div className="space-y-2">
            {utilityNavItems.map((item) => (
              <div key={item.path} className="rounded-2xl border border-gold/12 bg-black/20 p-3">
                <button
                  type="button"
                  onClick={() => goTo(item.path)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                    isActive(item.path)
                      ? "bg-gold/12 text-gold"
                      : "text-foreground/80 hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {t[item.key]}
                </button>
                <div className="mt-2 space-y-1 pl-2">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => {
                        if (item.key === "intranet" && child.id === "login") {
                          goTo("/admin/login");
                        } else {
                          goTo(`${item.path}#${child.id}`);
                        }
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                    >
                      {t[child.key]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold/65">
          {t.resourcesDirectory}
        </p>
        {coreNavItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => goTo(item.path)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-300",
              isActive(item.path)
                ? "border-gold/30 bg-gold/12 text-gold shadow-[inset_0_1px_0_hsl(var(--gold)/0.15)]"
                : "border-white/5 bg-white/[0.03] text-foreground/78 hover:border-gold/15 hover:bg-white/[0.06] hover:text-foreground",
            )}
          >
            <span className="font-display text-sm tracking-[0.08em]">{t[item.key]}</span>
            {isActive(item.path) ? <div className="h-2.5 w-2.5 rounded-full bg-gold/70" /> : null}
          </button>
        ))}
      </div>

      <div className="space-y-4 border-t border-gold/10 pt-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-1.5">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition",
              lang === "en"
                ? "gold-gradient-bg text-secondary-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition",
              lang === "fr"
                ? "gold-gradient-bg text-secondary-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            FR
          </button>
        </div>
      </div>
    </aside>
  );
}
