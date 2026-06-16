import { useEffect, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { resolveCoatOfArmsImage } from "@/components/SiteCoatOfArms";
import { SECTION_EMOJIS } from "@/lib/section-emojis";
import { usePages } from "@/api/pages";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import { useI18n } from "@/lib/i18n";
import {
  isExternalUrl,
  isInternalAppPath,
  resolveHistoryTimelineLink,
} from "@/features/history/history-timeline";

export default function HistoryPage() {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("history");
  const { data: pagesData } = usePages();
  const navigate = useNavigate();
  const location = useLocation();

  const introductionPage = pagesData?.pages.find((p) => p.key === "introduction");
  const coatOfArmsImage = resolveCoatOfArmsImage(introductionPage);

  const paragraphs = splitParagraphs(content);
  const intro = paragraphs[0] ?? "";
  const narrative = paragraphs.slice(1);

  const events = (page?.timeline || []).map((item, index) => ({
    ...item,
    side: index % 2 === 0 ? "right" : "left",
    ...resolveHistoryTimelineLink(item, index),
    title: localize(item.title),
    description: localize(item.description),
    image: item.image?.trim() || "",
  }));

  const heroImage = page?.images?.[0];
  const galleryImages = heroImage ? page!.images!.slice(1) : page?.images ?? [];
  const hasContent = Boolean(title || paragraphs.length || events.length || page?.images?.length);

  useEffect(() => {
    if (!location.hash) return;

    const hash = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, events.length]);

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  function navigateToEvent(href: string) {
    if (isInternalAppPath(href)) return navigate(href);
    if (isExternalUrl(href)) return window.location.assign(href);
  }

  function handleEventKeyDown(event: KeyboardEvent<HTMLElement>, href: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    navigateToEvent(href);
  }

  if (!hasContent) return <PageNotFoundState />;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 sm:space-y-14">
      {/* Coat of arms beside title */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-gold/20 bg-[linear-gradient(160deg,rgba(255,205,86,0.08),rgba(0,0,0,0.88))] px-4 py-6 shadow-[0_32px_100px_rgba(0,0,0,0.45)] sm:rounded-[2rem] sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--gold)/0.14),transparent_55%)]"
          aria-hidden
        />

        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_240px] lg:gap-10">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl font-bold gold-gradient-text sm:text-4xl lg:text-5xl">
              {title || t.historyTitle}
            </h1>
            <p className="text-sm uppercase tracking-[0.28em] text-gold/65 sm:text-xs">
              {t.historySubtitle}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[220px] lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-gold/25 bg-black/70 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-4">
              <img
                src={coatOfArmsImage}
                alt={t.coatOfArms}
                className="mx-auto h-36 w-full object-contain sm:h-40"
              />
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-[0.26em] text-gold/65 lg:text-right">
              {t.coatOfArms}
            </p>
          </div>
        </div>

        {intro ? (
          <p className="relative mt-6 max-w-4xl text-base leading-8 text-foreground/78 sm:mt-8 sm:text-lg">
            {intro}
          </p>
        ) : null}

        {heroImage ? (
          <div className="relative mt-6 overflow-hidden rounded-[1.25rem] border border-gold/15 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:mt-8">
            <img
              src={heroImage}
              alt={title || page.key}
              className="h-44 w-full object-cover sm:h-56 md:h-64"
            />
          </div>
        ) : null}
      </section>

      {narrative.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {narrative.map((paragraph, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[1.5rem] border border-gold/12 bg-black/30 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.2)]"
            >
              <span className="mb-3 text-xl" aria-hidden>{SECTION_EMOJIS.historyScroll}</span>
              <p className="text-base leading-8 text-foreground/76">{paragraph}</p>
            </motion.article>
          ))}
        </section>
      ) : null}

      {events.length > 0 ? (
        <section id="timeline" className="scroll-mt-28">
          <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              <span aria-hidden>{SECTION_EMOJIS.historyTimeline}</span>
              {t.historyTimeline}
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>

          <div className="relative rounded-[1.75rem] border border-gold/15 bg-black/35 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-gold/50 via-gold/25 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

            <div className="space-y-8 sm:space-y-12">
              {events.map((event, index) => (
                <div
                  key={index}
                  id={event.slug}
                  className="grid grid-cols-[auto_1fr] items-start gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-8"
                >
                  <div className="flex flex-col items-center pt-3 sm:hidden">
                    <TimelineDot index={index} />
                  </div>

                  {event.side === "left" ? (
                    <>
                      <TimelineCard
                        event={event}
                        index={index}
                        align="right"
                        onActivate={() => navigateToEvent(event.href)}
                        onKeyDown={(keyboardEvent) => handleEventKeyDown(keyboardEvent, event.href)}
                      />
                      <div className="hidden sm:flex sm:justify-center">
                        <TimelineDot index={index} />
                      </div>
                      <div className="hidden sm:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden sm:block" />
                      <div className="hidden sm:flex sm:justify-center">
                        <TimelineDot index={index} />
                      </div>
                      <TimelineCard
                        event={event}
                        index={index}
                        align="left"
                        onActivate={() => navigateToEvent(event.href)}
                        onKeyDown={(keyboardEvent) => handleEventKeyDown(keyboardEvent, event.href)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {galleryImages.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[1.5rem] border border-gold/12 shadow-[0_18px_55px_rgba(0,0,0,0.22)]"
            >
              <img src={src} alt="" className="h-52 w-full object-cover sm:h-60" />
            </motion.div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function TimelineCard({
  event,
  index,
  align,
  onActivate,
  onKeyDown,
}: {
  event: {
    year?: string;
    title?: string;
    description?: string;
    href: string;
    image?: string;
  };
  index: number;
  align: "left" | "right";
  onActivate: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}) {
  const { t } = useI18n();

  return (
    <motion.article
      initial={{ opacity: 0, x: align === "left" ? 36 : -36 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      role="link"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      className={`group cursor-pointer rounded-[1.35rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(255,205,86,0.06),rgba(0,0,0,0.35))] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-[0_22px_60px_rgba(0,0,0,0.32)] focus:outline-none focus:ring-2 focus:ring-gold/40 sm:rounded-[1.6rem] sm:p-6 ${
        align === "right" ? "sm:text-right" : ""
      }`}
    >
      {event.year ? (
        <span
          className={`inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold sm:text-[11px] ${
            align === "right" ? "sm:float-right sm:ml-3" : ""
          }`}
        >
          {event.year}
        </span>
      ) : null}
      <h2 className="clear-both mt-1 text-lg font-semibold text-foreground sm:text-xl">{event.title}</h2>
      <p className="mt-3 text-sm leading-7 text-foreground/72">{event.description}</p>
      {event.image ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-gold/12 bg-black/25">
          <img
            src={event.image}
            alt={event.title || "Timeline event"}
            className="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-40"
          />
        </div>
      ) : null}
      <p
        className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/80 transition group-hover:text-gold sm:text-xs ${
          align === "right" ? "sm:text-right" : ""
        }`}
      >
        {t.openTimelineEntry} →
      </p>
    </motion.article>
  );
}

function TimelineDot({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="relative flex h-5 w-5 items-center justify-center"
    >
      <span className="absolute h-5 w-5 rounded-full bg-gold/25 blur-[2px]" />
      <span className="relative h-3.5 w-3.5 rounded-full border-2 border-gold bg-black shadow-[0_0_18px_hsl(var(--gold)/0.55)]" />
    </motion.div>
  );
}
