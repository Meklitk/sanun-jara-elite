import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { BookOpen, BarChart3, Building2 } from "lucide-react";

export default function ResourcesPage() {
  const { t } = useI18n();

  const sections = [
    { icon: BookOpen, title: t.organizationalRubric, desc: t.organizationalRubricDesc },
    { icon: BarChart3, title: t.statistics, desc: t.statisticsDesc },
    { icon: Building2, title: t.mandenOrganizations, desc: t.mandenOrganizationsDesc },
  ];

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

      {/* Resource Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center hover:bg-muted/30 transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <sec.icon className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-lg text-gold mb-3">{sec.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{sec.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel gold-border-glow rounded-xl p-8 mb-8"
      >
        <h2 className="font-display text-xl text-gold mb-6">{t.sources}</h2>
        <ol className="space-y-3 font-body text-foreground/80 list-decimal list-inside">
          <li>wikipedia.org/manden_empire</li>
          <li>wikipedia.org/sanun_jara (En création)</li>
          <li>Le Djeliba</li>
        </ol>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel gold-border-glow rounded-xl p-8"
      >
        <h2 className="font-display text-xl text-gold mb-4">{t.phone}</h2>
        <p className="font-body text-foreground/90 text-lg">1 (800) 636-5913</p>
      </motion.div>
    </div>
  );
}
