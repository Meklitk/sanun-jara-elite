import { Link } from "react-router-dom";

import type { DirectoryItem } from "@/api/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  items: DirectoryItem[];
};

function isExternalUrl(url: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith("//");
}

export default function FederationDirectoryList({ items }: Props) {
  const { t, localize } = useI18n();

  if (!items.length) return null;

  return (
    <div className="space-y-4 border-t border-gold/10 pt-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">
          {t.federationEntriesTitle}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{t.federationEntriesDesc}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const name = localize(item.name);
          const description = localize(item.description);
          const url = item.url?.trim();

          const card = (
            <article className="rounded-[1.55rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] transition hover:border-gold/25">
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              {description ? (
                <p className="mt-3 text-sm leading-7 text-foreground/72">{description}</p>
              ) : null}
              {url ? (
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {t.learnMore} →
                </p>
              ) : null}
            </article>
          );

          if (!url) {
            return (
              <div key={`${name}-${index}`}>
                {card}
              </div>
            );
          }

          if (isExternalUrl(url)) {
            return (
              <a key={`${name}-${index}`} href={url} target="_blank" rel="noreferrer" className="block">
                {card}
              </a>
            );
          }

          return (
            <Link key={`${name}-${index}`} to={url} className="block">
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
