import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { SECTION_EMOJIS } from "@/lib/section-emojis";

export default function CommercePage() {
  const { t } = useI18n();

  const categories = [
    { emoji: SECTION_EMOJIS.merchants, title: t.merchants, desc: t.merchantsDesc },
    { emoji: SECTION_EMOJIS.suppliers, title: t.suppliers, desc: t.suppliersDesc },
    { emoji: SECTION_EMOJIS.contactDirectory, title: t.contactDirectory, desc: t.contactDirectoryDesc },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mb-20"
      >
        <div className="mb-6 flex justify-center">
          <span className="text-5xl" aria-hidden>{SECTION_EMOJIS.commerce}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-display gold-gradient-text mb-6 leading-tight">
          {t.commerce}
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 font-body leading-relaxed">
          {t.commerceDesc}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -6 }}
            className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-gold/40 to-transparent"
          >
            <div className="glass-panel rounded-2xl p-8 text-center h-full transition-all duration-500 group-hover:bg-muted/40">
              <div className="mb-6 flex justify-center">
                <span className="text-4xl" aria-hidden>{cat.emoji}</span>
              </div>
              <h3 className="font-display text-xl text-gold mb-3 tracking-wide">
                {cat.title}
              </h3>
              <p className="text-sm text-foreground/70 font-body leading-relaxed">
                {cat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
