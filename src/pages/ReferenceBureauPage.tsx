import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Globe, Building, List } from "lucide-react";

export default function ReferenceBureauPage() {
  const { t } = useI18n();

  const sections = [
    { icon: Globe, title: t.byCountry, desc: t.byCountryDesc },
    { icon: Building, title: t.byOrganization, desc: t.byOrganizationDesc },
    { icon: List, title: t.byClassification, desc: t.byClassificationDesc },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.referenceBureau}
        </h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -4 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center hover:bg-muted/30 transition-all duration-500 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <sec.icon className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-lg text-gold mb-3">{sec.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{sec.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
