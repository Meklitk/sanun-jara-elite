import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function CommercePage() {
  const { t } = useI18n();

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.commerce}
        </h1>
        <p className="text-lg text-foreground/80 font-body max-w-2xl mx-auto">
          Promotion of merchandise from different merchants and entrepreneurs, with their contact information. A dedicated page for merchants in need of suppliers.
        </p>
      </motion.div>

      <div className="glass-panel gold-border-glow rounded-xl p-12 text-center">
        <p className="text-muted-foreground font-body italic">
          Commerce directory coming soon...
        </p>
      </div>
    </div>
  );
}
