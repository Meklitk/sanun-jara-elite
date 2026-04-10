import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type UtilityCard = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  accent?: "gold" | "crimson";
};

type UtilityLandingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  cards: UtilityCard[];
};

export default function UtilityLandingPage({
  eyebrow,
  title,
  intro,
  cards,
}: UtilityLandingPageProps) {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-gold/15 bg-black/35 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.34)] sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.38em] text-gold/70">{eyebrow}</p>
          <h1 className="text-4xl font-bold gold-gradient-text sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/76 sm:text-lg">{intro}</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {cards.map((card, index) => {
          const accentClass =
            card.accent === "crimson"
              ? "border-primary/25 bg-primary/10 text-foreground"
              : "border-gold/20 bg-gold/10 text-secondary-foreground";

          return (
            <motion.article
              key={card.id}
              id={card.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="group rounded-[1.75rem] border border-gold/15 bg-black/30 p-7 shadow-[0_22px_80px_rgba(0,0,0,0.28)] transition duration-300 hover:border-gold/30 hover:bg-black/40"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accentClass}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-foreground/72">{card.description}</p>
              <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                <span>{card.ctaLabel}</span>
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </div>
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
