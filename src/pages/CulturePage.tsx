import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Play, Mic, Newspaper } from "lucide-react";

export default function CulturePage() {
  const { t } = useI18n();

  const mediaCategories = [
    { icon: Play, title: t.djelisVideos, desc: t.djelisVideosDesc },
    { icon: Mic, title: t.donsosInterventions, desc: t.donsosInterventionsDesc },
    { icon: Newspaper, title: t.journalistsOfManden, desc: t.journalistsOfMandenDesc },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.culture}
        </h1>
        <p className="text-lg text-foreground/80 font-body max-w-2xl mx-auto">
          {t.cultureDesc}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {mediaCategories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center hover:bg-muted/30 transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-full crimson-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <cat.icon className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="font-display text-lg text-gold mb-3">{cat.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{cat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Video gallery placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel gold-border-glow rounded-xl p-12 text-center"
      >
        <Play className="w-12 h-12 text-gold/40 mx-auto mb-4" />
        <p className="text-muted-foreground font-body italic">
          {t.mediaGalleryComingSoon}
        </p>
      </motion.div>
    </div>
  );
}
