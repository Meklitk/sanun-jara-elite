import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Youtube } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { coreNavItems } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const footerLinkClass =
  "group inline-flex items-center gap-2 text-sm text-foreground/62 transition-all duration-300 hover:translate-x-0.5 hover:text-[#D4A017]";

const socialButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4A017]/18 bg-black/30 text-[#D4A017]/80 shadow-[inset_0_1px_0_rgba(212,160,23,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A017]/45 hover:bg-[#D4A017]/10 hover:text-[#D4A017] hover:shadow-[0_8px_24px_rgba(212,160,23,0.12)]";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#D4A017]/85">
      {children}
    </p>
  );
}

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  function onSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    setEmail("");
    toast.success(t.footerSubscribeSuccess);
  }

  return (
    <footer className="relative mt-auto shrink-0 overflow-hidden border-t border-[#D4A017]/30 shadow-[0_-12px_48px_rgba(0,0,0,0.45),0_-4px_32px_rgba(212,160,23,0.06)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,160,23,0.07),transparent_42%),radial-gradient(circle_at_80%_100%,rgba(212,160,23,0.05),transparent_38%),linear-gradient(180deg,#060606_0%,#000000_55%,#080604_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #D4A017 25%, transparent 25%, transparent 75%, #D4A017 75%), linear-gradient(45deg, #D4A017 25%, transparent 25%, transparent 75%, #D4A017 75%)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1700px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 xl:grid-cols-4 xl:gap-14">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#D4A017]/25 bg-black/40 p-2 shadow-[0_0_28px_rgba(212,160,23,0.12)]">
                <img
                  src="/images/emblem-sanunjara.png"
                  alt="Sanun Jara"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#D4A017]/75">Sanun Jara</p>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">{t.introSubtitle}</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-foreground/58">{t.footerMission}</p>
            <p className="text-xs text-foreground/42">
              © {year} Sanun Jara. {t.footerRights}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <SectionTitle>{t.footerNavigation}</SectionTitle>
            <nav aria-label={t.footerNavigation}>
              <ul className="space-y-3">
                {coreNavItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className={footerLinkClass}>
                      <span
                        className="h-1 w-1 rounded-full bg-[#D4A017]/0 transition-all duration-300 group-hover:w-2 group-hover:bg-[#D4A017]/70"
                        aria-hidden
                      />
                      {t[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <SectionTitle>{t.footerContact}</SectionTitle>
            <div className="space-y-4">
              <a
                href="mailto:info@sanunjara.com"
                className={cn(footerLinkClass, "hover:translate-x-0")}
              >
                <Mail className="h-4 w-4 shrink-0 text-[#D4A017]/75" />
                info@sanunjara.com
              </a>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61555027864138"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialButtonClass}
                  aria-label={t.facebook}
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <span
                  className={cn(socialButtonClass, "cursor-not-allowed opacity-35")}
                  title={t.footerSocialSoon}
                  aria-hidden
                >
                  <Instagram className="h-4 w-4" />
                </span>
                <span
                  className={cn(socialButtonClass, "cursor-not-allowed opacity-35")}
                  title={t.footerSocialSoon}
                  aria-hidden
                >
                  <Youtube className="h-4 w-4" />
                </span>
              </div>

              <Button
                asChild
                className="h-10 rounded-full border border-[#D4A017]/35 bg-transparent px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4A017] shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4A017]/60 hover:bg-[#D4A017]/10 hover:text-[#D4A017]"
                variant="outline"
              >
                <Link to="/bureau/contact">{t.footerContactUs}</Link>
              </Button>
            </div>
          </div>

          {/* Newsletter / Community */}
          <div className="space-y-5 sm:col-span-2 xl:col-span-1">
            <SectionTitle>{t.footerNewsletter}</SectionTitle>
            <p className="text-sm leading-7 text-foreground/58">{t.footerNewsletterDesc}</p>
            <form onSubmit={onSubscribe} className="space-y-3">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.footerEmailPlaceholder}
                required
                className="h-11 rounded-xl border-[#D4A017]/18 bg-black/35 text-foreground placeholder:text-foreground/35 focus-visible:border-[#D4A017]/45 focus-visible:ring-[#D4A017]/25"
              />
              <Button
                type="submit"
                className="h-11 w-full rounded-xl border border-[#D4A017]/50 bg-[linear-gradient(135deg,#D4A017,#B8860B)] text-xs font-bold uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(212,160,23,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                {t.footerSubscribe}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#D4A017]/12 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/38">{t.introMotto}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A017]/42">{t.footerDevelopedBy}</p>
        </div>
      </div>
    </footer>
  );
}
