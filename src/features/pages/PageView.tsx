import { useMemo } from "react";
import { usePages } from "@/api/pages";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

function Paragraphs({ text }: { text: string }) {
  const parts = text.split(/\n\s*\n/g).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="prose prose-invert max-w-none prose-p:text-foreground/80 prose-a:text-gold">
      {parts.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </div>
  );
}

export default function PageView({ pageKey }: { pageKey: string }) {
  const { localize, t } = useI18n();
  const { data, isLoading, error } = usePages();

  const page = useMemo(() => data?.pages.find((p) => p.key === pageKey), [data, pageKey]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-6 w-56 bg-muted/40 rounded" />
        <div className="mt-6 h-40 bg-muted/20 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="glass-panel p-6">
          <div className="text-sm text-destructive">Failed to load content.</div>
        </Card>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8">
        <Card className="glass-panel p-6">
          <div className="text-sm text-muted-foreground">Page not found.</div>
        </Card>
      </div>
    );
  }

  const title = localize(page.title);
  const content = localize(page.content);
  const donationLink = page.links?.[0]?.url || "";
  const resourceLinks = pageKey === "economy" ? page.links?.slice(1) ?? [] : page.links ?? [];
  const showIntroHero = pageKey === "introduction";
  const heroImage = page.images?.[0] || "/images/manden-hero-wide.png";

  return (
    <div className="section-fade-in">
      {showIntroHero ? (
        <div className="relative -mx-0 -mt-0 mb-10 overflow-hidden border-b border-gold/15 md:rounded-b-2xl">
          <div className="relative h-52 md:h-64 lg:h-72">
            <img
              src={heroImage}
              alt=""
              role="presentation"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.12),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <p className="mb-1 text-[10px] font-display uppercase tracking-[0.35em] text-gold/90">
                Manden Empire
              </p>
              <h1 className="text-3xl font-bold gold-gradient-text drop-shadow-sm md:text-4xl lg:text-5xl">
                {title || page.key}
              </h1>
              <div className="mt-4 md:mt-6 flex items-center gap-3 md:gap-4">
                <div className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-xl border border-gold/20 shadow-[0_0_20px_rgba(255,205,86,0.2)]">
                  <img
                    src="/images/coat-of-arms-manden.png"
                    alt="Coat of Arms"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="relative h-14 w-20 md:h-16 md:w-24 overflow-hidden rounded-xl border border-gold/20 shadow-[0_0_20px_rgba(255,205,86,0.2)]">
                  <img
                    src="/images/realFlag.jpeg"
                    alt="Flag of Manden"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="px-8 pb-10 pt-2">
        {!showIntroHero ? (
          <header className="mb-8">
            <div className="mb-3 h-1 w-20 rounded-full bg-gradient-to-r from-gold/70 to-gold/10" />
            <h1 className="text-3xl font-bold gold-gradient-text">{title || page.key}</h1>
          </header>
        ) : null}

      {pageKey === "history" && page.timeline?.length ? (
        <div className="space-y-4">
          {page.timeline.map((item, idx) => (
            <Card key={idx} className="glass-panel p-5 gold-border-glow">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <div className="shrink-0 text-gold font-display tracking-wide">{item.year}</div>
                <div className="flex-1">
                  <div className="font-display text-lg">{localize(item.title)}</div>
                  {localize(item.description) ? (
                    <div className="mt-2 text-sm text-foreground/75">{localize(item.description)}</div>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-panel p-6 gold-border-glow">
          {content ? (
            <Paragraphs text={content} />
          ) : (
            <div className="text-sm text-muted-foreground">No content yet.</div>
          )}

          {pageKey === "economy" && donationLink ? (
            <div className="mt-6">
              <Button
                className="gold-gradient-bg text-secondary-foreground font-semibold"
                asChild
              >
                <a href={donationLink} target="_blank" rel="noreferrer">
                  Donate <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ) : null}

          {resourceLinks.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {resourceLinks.map((link, index) => {
                const label = localize(link.label) || link.url || `${t.openLink} ${index + 1}`;
                const hasUrl = Boolean(link.url?.trim());

                return (
                  <div
                    key={`${label}-${index}`}
                    className="rounded-xl border border-gold/12 bg-white/[0.03] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{label}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.22em] text-gold/72">
                          {hasUrl ? t.openLink : t.linkUnavailable}
                        </div>
                      </div>

                      {hasUrl ? (
                        <Button variant="outline" size="sm" className="border-gold/20 bg-black/20 hover:bg-gold/10" asChild>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <div className="rounded-lg border border-gold/10 px-3 py-2 text-xs text-muted-foreground">
                          {t.linkUnavailable}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </Card>
      )}

      {page.images?.length ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.images.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-xl border border-gold/15 bg-muted/20 shadow-[0_0_0_1px_hsl(var(--gold)/0.06)]"
            >
              <img src={src} alt="" className="h-44 w-full object-cover transition hover:scale-[1.02]" />
            </div>
          ))}
        </div>
      ) : null}
      </div>
    </div>
  );
}

