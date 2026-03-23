import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Users, HelpCircle, Briefcase } from "lucide-react";

export default function GlobalPerspectivesPage() {
  const { t } = useI18n();

  const actions = [
    { icon: Users, title: t.wantToJoin, desc: t.wantToJoinDesc, color: "gold-gradient-bg" },
    { icon: HelpCircle, title: t.haveQuestions, desc: t.haveQuestionsDesc, color: "crimson-gradient-bg" },
    { icon: Briefcase, title: t.iAmEntrepreneur, desc: t.iAmEntrepreneurDesc, color: "gold-gradient-bg" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.globalPerspectives}
        </h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -6 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center cursor-pointer hover:bg-muted/30 transition-all duration-500 group"
          >
            <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-xl text-gold mb-3">{action.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{action.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
