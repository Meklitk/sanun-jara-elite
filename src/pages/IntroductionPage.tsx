import { motion } from "framer-motion";

import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";

export default function IntroductionPage() {
  const { page, title, content, isLoading, error } = useCmsPage("introduction");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] space-y-12 pb-16">
      <section className="relative mx-auto max-w-7xl px-6 pt-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
          <img
            src="/images/hero-landscape.jpg"
            alt={title || "Manden Empire"}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

          <div className="relative px-10 py-16 lg:px-16 lg:py-20">
            <div className="flex max-w-4xl flex-col justify-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-xs uppercase tracking-[0.5em] text-gold/80"
              >
                Sanunjara Reincarnate
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl font-display font-bold leading-tight text-gold drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] md:text-7xl"
              >
                {title || "Manden Empire"}
              </motion.h1>

              {paragraphs[0] ? (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 max-w-xl text-lg italic text-foreground/70"
                >
                  {paragraphs[0]}
                </motion.p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 px-6">
        {paragraphs.slice(1).length ? (
          paragraphs.slice(1).map((paragraph, index) => (
            <motion.article
              key={`${paragraph.slice(0, 24)}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="rounded-[1.75rem] border border-gold/12 bg-black/28 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <p className="text-lg leading-8 text-foreground/80">{paragraph}</p>
            </motion.article>
          ))
        ) : (
          <PageNotFoundState />
        )}
      </section>
    </div>
  );
}
