import { useState } from "react";
import { ChevronDown, Menu, Languages, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarNav from "@/components/SidebarNav";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { utilityNavItems } from "@/lib/site-config";

export default function TopBar() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);

  const toggleLang = () => setLang(lang === "en" ? "fr" : "en");

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-2xl border border-gold/12 bg-black/20 text-foreground hover:bg-white/5 lg:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t.mobileMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[92vw] max-w-sm overflow-y-auto border-gold/15 bg-background/98 px-5 py-8"
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="font-display text-2xl gold-gradient-text">Sanun jara</SheetTitle>
                <SheetDescription>{t.quickSearchPlaceholder}</SheetDescription>
              </SheetHeader>
              <SidebarNav
                mode="mobile"
                includeUtilityNav
                onNavigate={() => setMobileOpen(false)}
              />
              <div className="mt-6 pt-6 border-t border-gold/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleLang();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-xl border-gold/20 bg-black/20 text-gold hover:bg-gold/10 hover:text-gold"
                >
                  <Languages className="mr-2 h-4 w-4" />
                  {lang === "en" ? "Français" : "English"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 rounded-2xl px-1 text-left"
          >
            <img
              src="/images/emblem-sanunjara.png"
              alt="Sanunjara emblem"
              className="h-12 w-12 rounded-2xl object-cover ring-1 ring-gold/25"
            />
            <div>
              <p className="font-display text-2xl font-semibold text-foreground">Sanun jara</p>
              <p className="text-[11px] uppercase tracking-[0.32em] text-gold/62">{t.reincarnate}</p>
            </div>
          </button>
        </div>

        <nav className="hidden items-center gap-2 xl:flex">
          {utilityNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isOpen = activeMenu === item.path;

            return (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.path)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveMenu(isOpen ? null : item.path)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-foreground/78 hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <span>{t[item.key]}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isOpen ? "rotate-180 text-gold" : "text-muted-foreground",
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "pointer-events-none absolute left-0 top-[calc(100%+0.75rem)] w-72 rounded-[1.5rem] border border-gold/15 bg-background/96 p-3 opacity-0 shadow-[0_26px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-200",
                    "before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']",
                    isOpen && "pointer-events-auto opacity-100",
                  )}
                >
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => navigate(child.path || `${item.path}#${child.id}`)}
                      className="block w-full rounded-xl px-4 py-3 text-left text-sm text-foreground/80 transition hover:bg-white/5 hover:text-foreground"
                    >
                      {t[child.key]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            type="button"
            onClick={() => setFlagOpen(true)}
            className="rounded-xl border border-gold/15 bg-black/25 p-2 transition hover:border-gold/30 hover:bg-gold/5 lg:hidden"
          >
            <img
              src="/images/manden-flag-lion.svg"
              alt="Manden flag"
              className="h-8 w-12 object-contain"
            />
          </button>
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              className="rounded-xl border border-gold/15 bg-black/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gold/80 hover:bg-gold/10 hover:text-gold"
            >
              <Languages className="mr-2 h-4 w-4" />
              {lang === "en" ? "FR" : "EN"}
            </Button>
            <button
              type="button"
              onClick={() => setFlagOpen(true)}
              className="rounded-xl border border-gold/15 bg-black/25 p-2 transition hover:border-gold/30 hover:bg-gold/5"
            >
              <img
                src="/images/manden-flag-lion.svg"
                alt="Manden flag"
                className="h-10 w-14 object-contain"
              />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
        <DialogContent className="max-w-3xl border-gold/20 bg-gradient-to-b from-black to-black/95">
          <DialogHeader>
            <DialogTitle className="gold-gradient-text text-2xl text-center">Flag of Manden</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 md:p-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-gold/30 shadow-[0_0_60px_rgba(255,205,86,0.15)]">
              <img
                src="/images/realFlag.jpeg"
                alt="Flag of Manden"
                className="max-w-full h-auto max-h-[60vh] md:max-h-[500px] object-contain"
              />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground pb-2">
            The official flag of the Manden Empire
          </p>
        </DialogContent>
      </Dialog>
    </header>
  );
}
