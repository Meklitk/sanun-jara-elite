import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function IntroductionPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] pb-16">
      
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 pt-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
          
          {/* Background */}
          <img
            src="/images/manden-hero-wide.png"
            alt="Manden Empire"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

          {/* CONTENT */}
          <div className="relative px-10 py-16 lg:px-16 lg:py-20 grid lg:grid-cols-[1.6fr_1fr] gap-10">

            {/* LEFT TEXT */}
            <div className="flex flex-col justify-center">
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xs uppercase tracking-[0.5em] text-gold/80 mb-6"
              >
                {t.introSubtitle}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-display font-bold text-gold leading-tight drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              >
                {t.introTitle}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg text-foreground/70 max-w-xl italic"
              >
                {t.introMotto}
              </motion.p>

            </div>

            {/* RIGHT VISUAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-col items-center justify-center gap-6"
            >
              
              {/* Coat of Arms */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-2xl opacity-40 group-hover:opacity-60 transition" />
                
                <img
                  src="/images/coat-of-arms-manden.png"
                  alt="Coat of Arms"
                  className="relative h-56 rounded-2xl border border-gold/20 bg-black/60 p-4 shadow-2xl"
                />
              </div>

              <p className="text-xs uppercase tracking-[0.3em] text-gold/70 text-center">
                {t.coatOfArms}
              </p>

            </motion.div>
          </div>

          

        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 mt-14 space-y-8">
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-lg leading-8 text-foreground/80"
        >
          {t.introP1}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-lg leading-8 text-foreground/80"
        >
          {t.introP2}
        </motion.p>

        {/* Highlight Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="border-l-4 border-gold/60 pl-6 py-4 text-gold italic text-lg bg-gradient-to-r from-gold/5 to-transparent"
        >
          {t.introP3}
        </motion.div>

      </section>
    </div>
  );
}