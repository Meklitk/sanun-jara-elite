import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import GoldDivider from "@/components/introduction/GoldDivider";
import type { TimelineItem } from "@/api/types";

type IntroTimelineProps = {
  title: string;
  viewAllLabel: string;
  events: Array<TimelineItem & { title: string; description: string }>;
};

export default function IntroTimeline({ title, viewAllLabel, events }: IntroTimelineProps) {
  if (events.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold gold-gradient-text">
          {title}
        </h2>
        <GoldDivider className="mx-auto mt-5 max-w-md" />
      </div>

      <div className="relative pl-8 sm:pl-10">
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent sm:left-[13px]" />

        <div className="space-y-8 sm:space-y-10">
          {events.map((event, index) => (
            <motion.article
              key={`${event.year}-${index}`}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="relative"
            >
              <motion.span
                initial={{ scale: 0.6 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#050505] shadow-[0_0_20px_rgba(212,175,55,0.25)] sm:-left-10 sm:h-7 sm:w-7"
              >
                <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              </motion.span>

              <div className="rounded-[24px] border border-gold/12 bg-black/40 p-5 backdrop-blur-sm transition duration-300 hover:border-gold/25 sm:p-6">
                <p className="font-mono text-xs tracking-[0.2em] text-[#D4AF37] sm:text-sm">
                  {event.year}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground sm:text-xl">
                  {event.title}
                </h3>
                {event.description ? (
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{event.description}</p>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold transition duration-300 hover:border-gold/40 hover:bg-gold/15"
        >
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
