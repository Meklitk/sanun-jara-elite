import { Link } from "react-router-dom";
import { Facebook, Mail } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { coreNavItems } from "@/lib/site-config";

const FOOTER_LINKS = [
  ...coreNavItems.filter((item) => item.key === "introduction" || item.key === "governance"),
  { key: "referenceBureau" as const, path: "/reference-bureau" },
  { key: "academy" as const, path: "/academy" },
];

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold/10 bg-black/25 backdrop-blur-sm">
      <div className="mx-auto max-w-[1700px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-gold/70">Sanun Jara</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{t.introSubtitle}</p>
            </div>
            <p className="max-w-md text-sm leading-7 text-foreground/65">{t.introMotto}</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">{t.footerQuickLinks}</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-foreground/70 transition hover:text-gold"
                  >
                    {t[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">{t.footerContact}</p>
            <div className="mt-4 space-y-3">
              <a
                href="mailto:info@sanunjara.com"
                className="inline-flex items-center gap-2 text-sm text-foreground/70 transition hover:text-gold"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold/70" />
                <span>info@sanunjara.com</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61555027864138"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-foreground/70 transition hover:text-gold"
              >
                <Facebook className="h-4 w-4 shrink-0 text-gold/70" />
                <span>{t.facebook}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gold/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-foreground/50">
            © {year} Sanun Jara. {t.footerRights}
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold/45">
            {t.footerDevelopedBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
