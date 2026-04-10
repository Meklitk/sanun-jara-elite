import { motion } from "framer-motion";

import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";

export default function HistoryPage() {
  const { page, title, content, isLoading, error, localize } = useCmsPage("history");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const intro = paragraphs[0] ?? "";
  const narrative = paragraphs.slice(1);
  const events = (page.timeline || []).map((item, index) => ({
    ...item,
    side: index % 2 === 0 ? "right" : "left",
    title: localize(item.title),
    description: localize(item.description),
  }));
  const heroImage = page.images?.[0];
  const galleryImages = heroImage ? page.images.slice(1) : page.images ?? [];
  const hasContent = Boolean(title || paragraphs.length || events.length || page.images?.length);

  if (!hasContent) return <PageNotFoundState />;

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.92),rgba(38,23,7,0.86))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold gold-gradient-text sm:text-5xl">{title || page.key}</h1>
            {intro ? (
              <p className="max-w-4xl text-base leading-8 text-foreground/76 sm:text-lg">{intro}</p>
            ) : null}
          </div>

          {heroImage ? (
            <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-black/25 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <img src={heroImage} alt={title || page.key} className="h-[260px] w-full object-cover sm:h-[340px]" />
            </div>
          ) : null}
        </div>
      </section>

      {narrative.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {narrative.map((paragraph, index) => (
            <motion.article
              key={`${paragraph.slice(0, 24)}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="rounded-[1.75rem] border border-gold/12 bg-black/28 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <p className="text-base leading-8 text-foreground/76">{paragraph}</p>
            </motion.article>
          ))}
        </section>
      ) : null}

      {events.length ? (
        <section className="relative overflow-hidden rounded-[2rem] border border-gold/15 bg-black/28 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-gold/45 via-gold/25 to-transparent md:block" />

          <div className="space-y-7">
            {events.map((event, index) => (
              <div
                key={`${event.year}-${index}`}
                className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6"
              >
                {event.side === "left" ? (
                  <>
                    <motion.article
                      initial={{ opacity: 0, x: -42, y: 18 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: index * 0.05, duration: 0.45 }}
                      className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:col-start-1 md:mr-6 md:text-right"
                    >
                      {event.year ? (
                        <p className="text-xs uppercase tracking-[0.28em] text-gold/72">{event.year}</p>
                      ) : null}
                      {event.title ? <h2 className="mt-3 text-xl font-semibold text-foreground">{event.title}</h2> : null}
                      {event.description ? (
                        <p className="mt-3 text-sm leading-7 text-foreground/70">{event.description}</p>
                      ) : null}
                    </motion.article>
                    <div className="relative z-10 hidden md:flex md:col-start-2 md:justify-center">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.35 }}
                        className="h-4 w-4 rounded-full bg-gold shadow-[0_0_20px_hsl(var(--gold)/0.45)]"
                      />
                    </div>
                    <div className="hidden md:block md:col-start-3" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block md:col-start-1" />
                    <div className="relative z-10 hidden md:flex md:col-start-2 md:justify-center">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.35 }}
                        className="h-4 w-4 rounded-full bg-gold shadow-[0_0_20px_hsl(var(--gold)/0.45)]"
                      />
                    </div>
                    <motion.article
                      initial={{ opacity: 0, x: 42, y: 18 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: index * 0.05, duration: 0.45 }}
                      className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:col-start-3 md:ml-6"
                    >
                      {event.year ? (
                        <p className="text-xs uppercase tracking-[0.28em] text-gold/72">{event.year}</p>
                      ) : null}
                      {event.title ? <h2 className="mt-3 text-xl font-semibold text-foreground">{event.title}</h2> : null}
                      {event.description ? (
                        <p className="mt-3 text-sm leading-7 text-foreground/70">{event.description}</p>
                      ) : null}
                    </motion.article>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {galleryImages.length ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="overflow-hidden rounded-[1.6rem] border border-gold/12 bg-black/28 shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
            >
              <img src={src} alt={title || page.key} className="h-60 w-full object-cover" />
            </motion.div>
          ))}
        </section>
      ) : null}
    </div>
  );
}
