import type { ReactNode } from "react";
import { ArrowLeft, Clock3, ScrollText } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useI18n } from "@/lib/i18n";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import {
  isExternalUrl,
  isInternalAppPath,
  resolveHistoryTimelineLink,
} from "@/features/history/history-timeline";

function TimelineEntryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  const className = `block rounded-[1.35rem] border px-4 py-4 text-left transition ${
    active
      ? "border-gold/35 bg-gold/10 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
      : "border-gold/12 bg-white/[0.03] hover:border-gold/25 hover:bg-white/[0.05]"
  }`;

  if (isInternalAppPath(href)) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target={isExternalUrl(href) ? "_blank" : undefined} rel={isExternalUrl(href) ? "noreferrer" : undefined} className={className}>
      {children}
    </a>
  );
}

export default function HistoryTimelineEventPage() {
  const { slug = "" } = useParams();
  const { lang, t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("history");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const events = (page.timeline || []).map((item, index) => ({
    ...resolveHistoryTimelineLink(item, index),
    year: item.year,
    title: localize(item.title),
    description: localize(item.description),
  }));
  const currentIndex = events.findIndex((event) => event.slug === slug);

  if (currentIndex === -1) return <PageNotFoundState />;

  const current = events[currentIndex];
  const overview =
    paragraphs[0] ||
    (lang === "fr"
      ? "Chaque evenement chronologique prolonge le recit historique du Manden et renvoie a la chronologie publique."
      : "Each timeline event extends the historical narrative of Manden and connects back to the public chronology.");
  const detailNote =
    current.description ||
    (lang === "fr"
      ? ""
      : "");
  const backTarget = `/history#${current.slug}`;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.94),rgba(39,25,8,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <Link to={backTarget} className="inline-flex items-center gap-2 text-sm text-gold/82 transition hover:text-gold">
          <ArrowLeft className="h-4 w-4" />
          <span>{t.returnToHistory}</span>
        </Link>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gold/82">
            {t.timelineEvent}
          </span>
          {current.year ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-foreground/76">
              {current.year}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl font-bold gold-gradient-text sm:text-5xl">{current.title || title || t.history}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/76">{detailNote}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[1.8rem] border border-gold/15 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.overview}</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">{current.title || t.historyTimeline}</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-base leading-8 text-foreground/76">
            <p>{overview}</p>
            <p>{detailNote}</p>
            <p>
              {lang === "fr"
                ? `${current.title || "Cet evenement"} reste relie a la chronologie complete de l'histoire du Manden.`
                : `${current.title || "This event"} remains connected to the full History of Manden timeline.`}
            </p>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-[1.6rem] border border-gold/15 bg-black/25 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                <ScrollText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.historyTimeline}</p>
                <p className="mt-1 text-sm text-foreground/72">{title || t.history}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <TimelineEntryLink key={event.slug} href={event.href} active={event.slug === current.slug}>
                <p className="text-[11px] uppercase tracking-[0.24em] text-gold/72">{event.year || t.timelineEvent}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{event.title || t.timelineEvent}</p>
              </TimelineEntryLink>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
