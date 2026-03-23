import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Store, Phone, Search, Package } from "lucide-react";

export default function CommercePage() {
  const { t } = useI18n();

  const categories = [
    { icon: Store, title: t.merchants, desc: t.merchantsDesc },
    { icon: Package, title: t.suppliers, desc: t.suppliersDesc },
    { icon: Phone, title: t.contactDirectory, desc: t.contactDirectoryDesc },
  ];

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
          {t.commerceDesc}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center hover:bg-muted/30 transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <cat.icon className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-lg text-gold mb-3">{cat.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{cat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Search placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel gold-border-glow rounded-xl p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Search className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg text-gold">{t.searchMerchants}</h3>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-lg gold-gradient-bg text-secondary-foreground font-display text-sm uppercase tracking-wider"
          >
            {t.search}
          </motion.button>
        </div>
        <p className="text-muted-foreground font-body italic text-sm mt-4 text-center">
          {t.commerceComingSoon}
        </p>
      </motion.div>
    </div>
  );
}
