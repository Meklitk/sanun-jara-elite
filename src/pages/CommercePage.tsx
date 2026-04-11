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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mb-20"
      >
        <h1 className="text-5xl md:text-6xl font-bold font-display gold-gradient-text mb-6 leading-tight">
          {t.commerce}
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 font-body leading-relaxed">
          {t.commerceDesc}
        </p>
      </motion.div>

      {/* CATEGORY CARDS */}
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
              
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <cat.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-display text-xl text-gold mb-3 tracking-wide">
                {cat.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-foreground/70 font-body leading-relaxed">
                {cat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SEARCH SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl"
      >
        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-xl">
          
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Search className="w-5 h-5 text-gold" />
            <h3 className="font-display text-lg text-gold tracking-wide">
              {t.searchMerchants}
            </h3>
          </div>

          {/* Input */}
          <div className="relative flex items-center gap-3">
            
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-4 rounded-xl bg-muted/40 border border-border focus:ring-2 focus:ring-gold/40 focus:outline-none transition-all font-body text-sm"
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-gold to-yellow-500 text-white font-display text-sm uppercase tracking-wide shadow-lg"
            >
              {t.search}
            </motion.button>
          </div>

          {/* Footer text */}
          <p className="text-center text-muted-foreground italic text-sm mt-6 font-body">
            {t.commerceComingSoon}
          </p>
        </div>
      </motion.div>
    </div>
  );
}