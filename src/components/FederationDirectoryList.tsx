import type { DirectoryItem } from "@/api/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  items: DirectoryItem[];
};

function sortAlphabetically(
  items: DirectoryItem[],
  localize: (value: { en?: string; fr?: string } | undefined) => string
) {
  return [...items].sort((a, b) => localize(a.name).localeCompare(localize(b.name)));
}

export default function FederationDirectoryList({ items }: Props) {
  const { t, localize } = useI18n();
  const sorted = sortAlphabetically(items, localize);

  if (!sorted.length) return null;

  return (
    <div className="space-y-4 border-t border-gold/10 pt-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">
          {t.federationEntriesTitle}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{t.federationEntriesDesc}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((item, index) => (
          <article
            key={`${localize(item.name)}-${index}`}
            className="rounded-[1.55rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.16)]"
          >
            <h3 className="text-lg font-semibold text-foreground">{localize(item.name)}</h3>
            {localize(item.description) ? (
              <p className="mt-3 text-sm leading-7 text-foreground/72">{localize(item.description)}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
