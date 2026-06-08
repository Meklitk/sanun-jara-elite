import { motion } from "framer-motion";

import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import { useI18n } from "@/lib/i18n";

export default function TombouctouPage() {
  const { t } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("tombouctou");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const featuredImage = page.featuredImage || page.images?.[0];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] space-y-8 sm:space-y-12 pb-12 sm:pb-16">
      <section className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-4 sm:pt-10">
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-gold/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-black/50 to-black" />

          <div className="relative px-4 sm:px-10 py-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="flex max-w-4xl flex-col justify-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 sm:mb-6 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gold/80"
              >
                {t.tombouctou}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl sm:text-5xl font-display font-bold leading-tight text-gold drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] md:text-7xl"
              >
                {title || t.tombouctou}
              </motion.h1>

              {paragraphs.length === 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-7 text-foreground/70"
                >
                  {t.tombouctouDesc}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </section>

      {featuredImage && (
        <section className="mx-auto max-w-4xl px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-gold/15 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
          >
            <img
              src={featuredImage}
              alt={title || t.tombouctou}
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
        </section>
      )}

      <section className="mx-auto max-w-5xl space-y-4 sm:space-y-6 px-3 sm:px-6">
        {paragraphs.length ? (
          paragraphs.map((paragraph, index) => (
            <motion.article
              key={`${paragraph.slice(0, 24)}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="rounded-[1.25rem] sm:rounded-[1.75rem] border border-gold/12 bg-black/28 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <p className="text-base sm:text-lg leading-7 sm:leading-8 text-foreground/80">{paragraph}</p>
            </motion.article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-gold/20 bg-black/15 px-6 py-10 text-center text-sm text-muted-foreground">
            Content for Tombouctou will appear here once added from the admin dashboard.
          </div>
        )}
      </section>
    </div>
  );
}
