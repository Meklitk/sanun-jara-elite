import { motion } from "framer-motion";

import ImageLightbox from "@/components/ImageLightbox";
import { SectionEmojiVisual } from "@/components/SectionEmojiVisual";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import {
  introductionFallbackSections,
  parseIntroductionSections,
  resolveSectionVisual,
  type IntroSection,
} from "@/features/introduction/intro-sections";
import { useI18n } from "@/lib/i18n";

const accentStyles = {
  gold: {
    icon: "border-gold/30 bg-gold/15 text-gold shadow-[0_0_30px_rgba(255,205,86,0.15)]",
    ring: "from-gold/40 via-gold/5 to-transparent",
    glow: "group-hover:shadow-[0_28px_80px_rgba(255,205,86,0.12)]",
  },
  crimson: {
    icon: "border-primary/30 bg-primary/15 text-primary shadow-[0_0_30px_rgba(220,38,38,0.12)]",
    ring: "from-primary/35 via-primary/5 to-transparent",
    glow: "group-hover:shadow-[0_28px_80px_rgba(220,38,38,0.1)]",
  },
  amber: {
    icon: "border-amber-400/25 bg-amber-500/10 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    ring: "from-amber-400/30 via-amber-500/5 to-transparent",
    glow: "group-hover:shadow-[0_28px_80px_rgba(245,158,11,0.1)]",
  },
};

function layoutClass(layout: "featured" | "wide" | "standard") {
  if (layout === "featured" || layout === "wide") return "lg:col-span-2";
  return "lg:col-span-1";
}

function IntroductionSectionCard({
  section,
  index,
  lang,
}: {
  section: IntroSection;
  index: number;
  lang: "en" | "fr";
}) {
  const visual = resolveSectionVisual(section.heading, index);
  const styles = accentStyles[visual.accent];
  const tagline = lang === "fr" ? visual.taglineFr : visual.taglineEn;
  const imageAlt = lang === "fr" ? visual.imageAltFr : visual.imageAltEn;
  const number = String(index + 1).padStart(2, "0");
  const layout =
    index === 0 ? "featured" : index === 3 ? "wide" : ("standard" as const);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative ${layoutClass(layout)}`}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[1.5rem] border border-gold/12 bg-[linear-gradient(155deg,rgba(255,205,86,0.06),rgba(0,0,0,0.55))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-500 sm:rounded-[1.85rem] sm:p-7 ${styles.glow}`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${styles.ring} blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
        />
        <span className="absolute right-5 top-5 font-mono text-[11px] tracking-[0.35em] text-gold/40">
          {number}
        </span>

        <div className="relative flex flex-col sm:flex-row sm:items-start sm:gap-5">
          <SectionEmojiVisual
            imageSrc={visual.imageSrc}
            imageAlt={imageAlt}
            size="card"
            className="mb-4 h-14 w-14 shrink-0 rounded-2xl border-gold/20 bg-black/40 p-0 sm:mb-0"
          />
          <div className="min-w-0 flex-1">
            {section.heading ? (
              <div className="mb-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold/65">
                  {tagline}
                </p>
                <h2 className="font-display text-2xl font-bold leading-tight gold-gradient-text sm:text-3xl">
                  {section.heading}
                </h2>
              </div>
            ) : null}

            <p className="text-base leading-7 text-foreground/82 whitespace-pre-line sm:text-[1.05rem] sm:leading-8">
              {section.body}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </motion.article>
  );
}

export default function IntroductionPage() {
  const { lang, t } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("introduction");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const parsedSections = parseIntroductionSections(content);
  const sections: IntroSection[] =
    parsedSections.length > 0 ? parsedSections : [...introductionFallbackSections[lang]];

  const showcaseImage = page.featuredImage || page.images?.[0];
  const galleryImages = showcaseImage
    ? (page.images ?? []).filter((img) => img !== showcaseImage)
    : (page.images ?? []).slice(1);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] space-y-10 pb-14 sm:space-y-14 sm:pb-20">
      {/* Hero — text on landscape */}
      <section className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-gold/15 sm:rounded-[2.5rem]"
        >
          <img
            src="/images/hero-landscape.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          <div className="relative flex min-h-[300px] flex-col justify-end px-6 py-10 sm:min-h-[380px] sm:px-10 sm:py-12 lg:min-h-[420px] lg:px-14 lg:py-14">
            <div className="max-w-2xl">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.4em] text-gold sm:text-xs">
                {t.introHeroEyebrow}
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-gold [text-shadow:0_2px_20px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
                {title || "Manden Empire"}
              </h1>
              {sections[0]?.body ? (
                <p className="mt-4 text-sm leading-7 text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)] sm:text-base sm:leading-8">
                  {sections[0].body.split("\n")[0]}
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured image — separate block below hero */}
      {showcaseImage ? (
        <section className="mx-auto max-w-5xl px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40 sm:w-16" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold/70">
                {lang === "fr" ? "Image à la une" : "Featured image"}
              </p>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40 sm:w-16" />
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/20 bg-black/40 p-2 shadow-[0_28px_80px_rgba(0,0,0,0.45)] transition duration-300 hover:border-gold/35 sm:rounded-[2rem] sm:p-2.5">
              <div className="relative overflow-hidden rounded-[1.35rem] sm:rounded-[1.5rem]">
                <ImageLightbox
                  src={showcaseImage}
                  alt={title || "Manden Empire"}
                  className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:aspect-[2/1]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </section>
      ) : null}

      {/* Section lead */}
      <section className="mx-auto max-w-6xl px-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            <img
              src="/images/emblem-sanunjara.png"
              alt=""
              aria-hidden
              className="h-5 w-5 rounded-full object-cover"
            />
            {t.introSectionsLead}
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t.introSectionsSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Introduction sections — Vision, Mission, etc. */}
      <section className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {sections.map((section, index) => (
            <IntroductionSectionCard
              key={`${section.heading ?? "section"}-${index}`}
              section={section}
              index={index}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* Extra images gallery */}
      {galleryImages.length > 0 ? (
        <section className="mx-auto max-w-6xl px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5"
          >
            {galleryImages.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-[1.25rem] border border-gold/15 bg-black/30 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                <ImageLightbox
                  src={src}
                  alt={`${title || "Manden Empire"} ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      ) : null}
    </div>
  );
}
