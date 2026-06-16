import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

import { SectionEmojiVisual } from "@/components/SectionEmojiVisual";

type UtilityCard = {
  id: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  accent?: "gold" | "crimson";
  href?: string;
  emoji?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type UtilityLandingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  cards: UtilityCard[];
};

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function isExternalHref(href: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//");
}

function UtilityCardVisual({
  emoji,
  imageUrl,
  imageAlt,
}: {
  emoji?: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  if (showImage) {
    return (
      <div
        className="mb-4 sm:mb-6 h-24 w-full sm:h-28 overflow-hidden rounded-xl sm:rounded-2xl border border-gold/15 bg-black/30 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
      >
        <img
          src={imageUrl}
          alt={imageAlt || ""}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  if (!emoji) return null;

  return <SectionEmojiVisual emoji={emoji} size="card" />;
}

export default function UtilityLandingPage({
  eyebrow,
  title,
  intro,
  cards,
}: UtilityLandingPageProps) {
  const introParagraphs = splitParagraphs(intro);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-gold/15 bg-black/35 p-4 sm:p-6 sm:p-8 lg:p-10 shadow-[0_28px_100px_rgba(0,0,0,0.34)]">
        <div className="max-w-3xl">
          <p className="mb-3 sm:mb-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.38em] text-gold/70">{eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl font-bold gold-gradient-text sm:text-5xl">{title}</h1>
          <div className="mt-4 sm:mt-5 max-w-2xl space-y-3 sm:space-y-4 text-sm sm:text-base leading-7 sm:leading-8 text-foreground/76 sm:text-lg">
            {introParagraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {cards.length ? (
        <section className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const CardContent = (
            <motion.article
              key={card.id}
              id={card.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="group rounded-[1.25rem] sm:rounded-[1.75rem] border border-gold/15 bg-black/30 p-4 sm:p-7 shadow-[0_22px_80px_rgba(0,0,0,0.28)] transition duration-300 hover:border-gold/30 hover:bg-black/40 block"
            >
              <UtilityCardVisual emoji={card.emoji} imageUrl={card.imageUrl} imageAlt={card.imageAlt || card.title} />
              <h2 className="text-lg sm:text-2xl font-semibold text-foreground">{card.title}</h2>
              <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-foreground/72">{card.description}</p>
              <div className="mt-4 sm:mt-7 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gold">
                <span>{card.ctaLabel}</span>
                <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4 transition duration-300 group-hover:translate-x-1" />
              </div>
            </motion.article>
          );

          if (!card.href) return CardContent;

          return isExternalHref(card.href) ? (
            <a key={card.id} href={card.href} target="_blank" rel="noreferrer" className="block">
              {CardContent}
            </a>
          ) : (
            <Link key={card.id} to={card.href} className="block">
              {CardContent}
            </Link>
          );
        })}
        </section>
      ) : (
        <section className="rounded-[1.25rem] sm:rounded-[1.75rem] border border-dashed border-gold/20 bg-black/20 px-4 sm:px-6 py-8 sm:py-12 text-center text-sm sm:text-base text-muted-foreground">
          No items have been configured for this section yet.
        </section>
      )}
    </div>
  );
}
