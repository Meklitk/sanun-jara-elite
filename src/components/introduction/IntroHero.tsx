import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type IntroHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function IntroHero({ eyebrow, title, subtitle }: IntroHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.75]);

  return (
    <section ref={ref} className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-4 sm:pt-8">
      <div className="relative overflow-hidden rounded-[24px] border border-gold/20 shadow-[0_40px_120px_rgba(0,0,0,0.65)] sm:rounded-[28px]">
        <motion.div style={{ y: imageY }} className="absolute inset-0 will-change-transform">
          <img
            src="/images/hero-landscape.jpg"
            alt=""
            aria-hidden
            className="h-[120%] w-full object-cover object-center"
          />
        </motion.div>

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.12),transparent_55%)]" />

        <motion.div
          style={{ y: contentY }}
          className="relative flex min-h-[340px] items-end px-5 py-10 sm:min-h-[420px] sm:px-10 sm:py-14 lg:min-h-[480px] lg:px-14"
        >
          <div className="w-full max-w-2xl rounded-[24px] border border-gold/20 bg-[#050505]/45 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#D4AF37] sm:text-xs">
              {eyebrow}
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[1.05] text-[#D4AF37]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/88 sm:text-base sm:leading-8">
                {subtitle}
              </p>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
