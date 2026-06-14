import { useState } from "react";
import { ChevronDown, Menu, Languages, X, Facebook } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarNav from "@/components/SidebarNav";
import {
  Sheet,
  SheetContent,
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
  const [mobileNavKey, setMobileNavKey] = useState(0);
  const [flagOpen, setFlagOpen] = useState(false);

  function handleMobileOpenChange(open: boolean) {
    setMobileOpen(open);
    if (!open) setMobileNavKey((key) => key + 1);
  }

  const toggleLang = () => setLang(lang === "en" ? "fr" : "en");

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-gold/10 bg-background/95 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 overflow-visible px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-2xl border border-gold/12 bg-black/20 text-foreground hover:bg-white/5 xl:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t.mobileMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-full max-w-[min(100vw,22rem)] flex-col border-gold/20 bg-[#050505]/98 p-0 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
                <SheetHeader className="space-y-1 text-left">
                  <SheetTitle className="font-display text-xl gold-gradient-text">Sanun Jara</SheetTitle>
                </SheetHeader>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMobileOpenChange(false)}
                  className="shrink-0 rounded-xl border border-gold/15 text-gold hover:bg-gold/10"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <SidebarNav
                  key={mobileNavKey}
                  mode="mobile"
                  includeUtilityNav
                  onNavigate={() => handleMobileOpenChange(false)}
                />
              </div>

              <div className="space-y-2 border-t border-gold/10 px-5 py-4">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    navigate("/bureau/cotiser");
                    handleMobileOpenChange(false);
                  }}
                  className="w-full rounded-xl border border-gold/30 bg-gold/15 text-gold hover:bg-gold/25"
                >
                  {t.iAmEntrepreneur}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleLang();
                      handleMobileOpenChange(false);
                    }}
                    className="rounded-xl border-gold/20 bg-black/20 text-gold hover:bg-gold/10"
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    {lang === "en" ? "FR" : "EN"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-gold/20 bg-black/20 text-gold hover:bg-gold/10"
                  >
                    <a
                      href="https://www.facebook.com/profile.php?id=61555027864138"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMobileOpenChange(false)}
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      {t.facebook}
                    </a>
                  </Button>
                </div>
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

        <nav className="hidden items-center gap-2 overflow-visible xl:flex">
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
                    isActive || isOpen
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
                    "absolute left-0 top-full z-[60] w-72 pt-2 transition-opacity duration-200",
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <div className="rounded-[1.5rem] border border-gold/25 bg-black p-2 shadow-[0_26px_70px_rgba(0,0,0,0.65)] ring-1 ring-gold/10">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          setActiveMenu(null);
                          navigate(child.path || `${item.path}#${child.id}`);
                        }}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-gold/10 hover:text-gold"
                      >
                        {t[child.key]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=61555027864138"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl border border-gold/15 bg-black/20 p-2 text-gold/80 transition hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
            aria-label={t.facebook}
          >
            <Facebook className="h-4 w-4" />
          </a>
          <Button
            type="button"
            size="sm"
            onClick={() => navigate("/bureau/cotiser")}
            className="hidden rounded-xl border border-gold/30 bg-gold/15 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gold hover:bg-gold/25 hover:text-gold sm:inline-flex"
          >
            {t.iAmEntrepreneur}
          </Button>
          <button
            type="button"
            onClick={() => setFlagOpen(true)}
            className="rounded-xl border border-gold/15 bg-black/25 p-2 transition hover:border-gold/30 hover:bg-gold/5 xl:hidden"
          >
            <img
              src="/images/manden-flag-lion.svg"
              alt="Manden flag"
              className="h-8 w-12 object-contain"
            />
          </button>
          <div className="hidden items-center gap-3 xl:flex">
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
            <DialogTitle className="gold-gradient-text text-2xl text-center">{t.flagOfManden}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 md:p-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-gold/30 shadow-[0_0_60px_rgba(255,205,86,0.15)]">
              <img
                src="/images/realFlag.jpeg"
                alt={t.flagOfManden}
                className="max-w-full h-auto max-h-[60vh] md:max-h-[500px] object-contain"
              />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground pb-2">
            {t.flagOfMandenDesc}
          </p>
        </DialogContent>
      </Dialog>
    </header>
  );
}
