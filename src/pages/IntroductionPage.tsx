import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import redFlag from "@/assets/red-flag.png";
import heroLandscape from "@/assets/hero-landscape.jpg";
import coatOfArms from "@/assets/coat-of-arms.jpg";

export default function IntroductionPage() {
  const { t } = useI18n();

  return (
    <div className="relative">
      {/* Hero Section with red flag */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background landscape */}
        <div className="absolute inset-0">
          <img
            src={heroLandscape}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Red flag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-8 right-12 w-48 h-auto"
        >
          <img src={redFlag} alt="Flag of Manden" className="w-full drop-shadow-2xl" />
        </motion.div>

        {/* Hero text */}
        <div className="relative z-10 text-center max-w-3xl px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm uppercase tracking-[0.4em] text-gold mb-4 font-display"
          >
            {t.introSubtitle}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-7xl font-display font-bold gold-gradient-text mb-6 leading-tight"
          >
            {t.introTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-muted-foreground italic font-body"
          >
            {t.introMotto}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-8 py-16 space-y-12">
        {/* Coat of Arms + Text */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <p className="text-lg leading-relaxed text-foreground/90 font-body">
              {t.introP1}
            </p>
            <p className="text-lg leading-relaxed text-foreground/90 font-body">
              {t.introP2}
            </p>
            <div className="h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />
            <p className="text-base leading-relaxed text-gold/80 italic font-body">
              {t.introP3}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="glass-panel gold-border-glow rounded-xl p-4">
              <img
                src={coatOfArms}
                alt={t.coatOfArms}
                className="w-56 h-auto rounded-lg"
              />
              <p className="text-center text-xs text-muted-foreground mt-3 font-display">
                {t.coatOfArms}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
