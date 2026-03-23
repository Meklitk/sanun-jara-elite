import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LogIn, UserPlus, UserCheck } from "lucide-react";

export default function IntranetPage() {
  const { t } = useI18n();

  const actions = [
    { icon: LogIn, title: t.connection, btn: t.connectBtn },
    { icon: UserPlus, title: t.notYetMember, btn: t.joinBtn },
    { icon: UserCheck, title: t.recommendSomeone, btn: t.recommendBtn },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.intranet}
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
            className="glass-panel gold-border-glow rounded-xl p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-6">
              <action.icon className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-xl text-gold mb-6">{action.title}</h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl crimson-gradient-bg text-foreground font-display uppercase tracking-[0.15em] text-sm hover:opacity-90 transition-opacity"
            >
              {action.btn}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
