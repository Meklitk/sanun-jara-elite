import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function ResourcesPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.resources}
        </h1>
      </motion.div>

      {/* Sources */}
      <div className="glass-panel gold-border-glow rounded-xl p-8 mb-8">
        <h2 className="font-display text-xl text-gold mb-6">{t.sources}</h2>
        <ol className="space-y-3 font-body text-foreground/80 list-decimal list-inside">
          <li>wikipedia.org/manden_empire</li>
          <li>wikipedia.org/sanun_jara (En création)</li>
          <li>Le Djeliba</li>
        </ol>
      </div>

      <div className="glass-panel gold-border-glow rounded-xl p-8">
        <h2 className="font-display text-xl text-gold mb-4">{t.phone}</h2>
        <p className="font-body text-foreground/90 text-lg">1 (800) 636-5913</p>
      </div>
    </div>
  );
}
