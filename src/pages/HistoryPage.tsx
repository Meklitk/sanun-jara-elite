import { useEffect, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const intro = paragraphs[0] ?? "";
  const narrative = paragraphs.slice(1);

  const events = (page.timeline || []).map((item, index) => ({
    ...item,
    side: index % 2 === 0 ? "right" : "left",
    ...resolveHistoryTimelineLink(item, index),
    title: localize(item.title),
    description: localize(item.description),
  }));

  const heroImage = page.images?.[0];
  const galleryImages = heroImage ? page.images.slice(1) : page.images ?? [];
  const hasContent = Boolean(title || paragraphs.length || events.length || page.images?.length);

  useEffect(() => {
    if (!location.hash) return;

    const hash = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, events.length]);

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
    <div className="space-y-12">

      {/* ✅ HERO - Logo + Content Side by Side */}
      <section className="max-w-6xl mx-auto overflow-hidden rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.92),rgba(38,23,7,0.86))] p-6 sm:p-8 lg:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
          {/* Content Left */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold gold-gradient-text sm:text-5xl">
              {title || page.key}
            </h1>

            {intro && (
              <p className="max-w-4xl text-base leading-8 text-foreground/76 sm:text-lg">
                {intro}
              </p>
            )}
          </div>

          {/* Hero Image Right */}
          {heroImage && (
            <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-black/25 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <img
                src={heroImage}
                alt={title || page.key}
                className="h-[220px] w-full object-cover sm:h-[280px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* ✅ NARRATIVE - Full Width */}
      {narrative.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-12">
          <div className="grid gap-4 lg:grid-cols-2">
            {narrative.map((paragraph, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[1.75rem] border border-gold/12 bg-black/28 p-6"
              >
                <p className="text-base leading-8 text-foreground/76">{paragraph}</p>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* 🔥 FULL WIDTH TIMELINE */}
      {events.length > 0 && (
        <section
          id="timeline"
          className="w-full px-4 sm:px-6 lg:px-12"
        >
          <div className="relative rounded-[2rem] border border-gold/15 bg-black/30 p-6 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

            {/* center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden md:block" />

            <div className="space-y-10">
              {events.map((event, index) => (
                <div
                  key={index}
                  id={event.slug}
                  className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center"
                >

                  {/* LEFT */}
                  {event.side === "left" ? (
                    <>
                      <TimelineCard
                        event={event}
                        index={index}
                        align="right"
                        onActivate={() => navigateToEvent(event.href)}
                        onKeyDown={(keyboardEvent) => handleEventKeyDown(keyboardEvent, event.href)}
                      />
                      <Dot index={index} />
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <Dot index={index} />
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
      )}

      {/* ✅ GALLERY - Full Width */}
      {galleryImages.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-[1.6rem] border border-gold/12"
            >
              <img src={src} className="h-60 w-full object-cover" />
            </motion.div>
          ))}
        </section>
      )}
    </div>
  );
}

/* 🔥 COMPONENTS */

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
  };
  index: number;
  align: "left" | "right";
  onActivate: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}) {
  const { t } = useI18n();
  
  return (
    <motion.article
      initial={{ opacity: 0, x: align === "left" ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      role="link"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      className={`cursor-pointer rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow transition hover:border-gold/30 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-gold/40 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {event.year && (
        <p className="text-xs uppercase tracking-[0.28em] text-gold/72">
          {event.year}
        </p>
      )}
      <h2 className="mt-3 text-xl font-semibold">{event.title}</h2>
      <p className="mt-3 text-sm text-foreground/70">{event.description}</p>
      <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold/75 ${align === "right" ? "text-right" : ""}`}>
        {t.openTimelineEntry}
      </p>
    </motion.article>
  );
}

function Dot({ index }: any) {
  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="h-4 w-4 rounded-full bg-gold shadow-[0_0_20px_hsl(var(--gold)/0.45)]"
      />
    </div>
  );
}
    