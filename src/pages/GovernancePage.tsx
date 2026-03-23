import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { ArrowDown, Shield, AlertTriangle } from "lucide-react";

export default function GovernancePage() {
  const { t } = useI18n();

  const leaders = [
    { role: t.mandenMansa, name: "Mari Diata Keita V" },
    { role: t.mandenDjeliba, name: "Mabougnata Djeliba Ibrahim Diabate" },
    { role: t.mandenMory, name: "Mabougnata Alpha Oumar Kaba" },
  ];

  const govInfo = [
    { label: t.govName, value: "Manden Empire" },
    { label: t.constitution, value: "Kouroukan Fouga — 1236" },
    { label: t.govType, value: t.monarchy },
  ];

  const branches = [
    {
      name: t.reflectionCommittee,
      power: "Filters ideas based on alignment with Manden principles",
      criteria: "Meritocratie",
    },
    {
      name: t.generalAssembly,
      power: "Obtention of consensus from within Manden community",
      criteria: "Meritocratie",
    },
    {
      name: t.legislativeCommittee,
      power: "Formulation and promulgation of governing protocoles",
      criteria: "Meritocratie",
    },
  ];

  const flowchartSteps = [
    { label: t.debut, icon: "🏁" },
    { label: t.reflectionCommitteeShort, icon: "🔍" },
    { label: t.generalAssemblyShort, icon: "🏛️" },
    { label: t.protocolApproved, icon: "✅" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-gold mb-3 font-display">
          {t.governanceSubtitle}
        </p>
        <h1 className="text-5xl font-display font-bold gold-gradient-text">
          {t.governanceTitle}
        </h1>
      </motion.div>

      {/* Chiefdom Leaders */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="font-display text-2xl text-gold mb-8">{t.chiefdom}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {leaders.map((leader, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-panel gold-border-glow rounded-xl p-6 text-center hover:bg-muted/30 transition-all duration-500"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold font-display mb-2">
                {leader.role}
              </p>
              <p className="text-foreground font-body text-lg">{leader.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Government Info */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="glass-panel rounded-xl overflow-hidden">
          {govInfo.map((item, i) => (
            <div
              key={i}
              className={`flex items-center px-8 py-5 ${
                i !== govInfo.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-xs uppercase tracking-[0.2em] text-gold font-display w-48 flex-shrink-0">
                {item.label}
              </span>
              <span className="text-foreground font-body">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Corruption & Risk Index */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Corruption Index */}
          <div className="glass-panel gold-border-glow rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg text-gold">{t.corruptionIndex}</h3>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-display text-muted-foreground mb-2">
                <span>{t.leastCorrupt}</span>
                <span>{t.mostCorrupt}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "8%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full gold-gradient-bg"
                />
              </div>
              <p className="text-xs text-gold font-display mt-2">{t.rankLabel}: ~15 / 195</p>
            </div>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">
              {t.corruptionDesc}
            </p>
          </div>

          {/* Risk Index */}
          <div className="glass-panel gold-border-glow rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full crimson-gradient-bg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-display text-lg text-gold">{t.riskIndex}</h3>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-display text-muted-foreground mb-2">
                <span>{t.lowRisk}</span>
                <span>{t.highRisk}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "12%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full crimson-gradient-bg"
                />
              </div>
              <p className="text-xs text-gold font-display mt-2">{t.stableGov}</p>
            </div>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">
              {t.riskDesc}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Branches of Government */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="font-display text-2xl text-gold mb-8">{t.branchesTitle}</h2>
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 px-8 py-4 border-b border-border bg-muted/30">
            <span className="text-xs uppercase tracking-[0.15em] text-gold font-display">Branch</span>
            <span className="text-xs uppercase tracking-[0.15em] text-gold font-display">Main Powers</span>
            <span className="text-xs uppercase tracking-[0.15em] text-gold font-display">Selection</span>
          </div>
          {branches.map((b, i) => (
            <div key={i} className={`grid grid-cols-3 px-8 py-5 ${i !== branches.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-foreground font-body font-medium">{b.name}</span>
              <span className="text-foreground/80 font-body text-sm">{b.power}</span>
              <span className="text-muted-foreground font-body text-sm">{b.criteria}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tax Information */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="glass-panel gold-border-glow rounded-xl p-8">
          <h3 className="font-display text-lg text-gold mb-3">{t.taxInfo}</h3>
          <p className="text-foreground/80 font-body">{t.taxInfoDesc}</p>
        </div>
      </motion.section>

      {/* Interactive Flowchart */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-2xl text-gold mb-8">{t.flowchartTitle}</h2>
        <div className="flex flex-col items-center gap-2">
          {flowchartSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className={`glass-panel gold-border-glow rounded-xl px-10 py-6 text-center cursor-default min-w-[280px] ${
                  i === 0 ? "crimson-gradient-bg" : i === flowchartSteps.length - 1 ? "gold-gradient-bg" : ""
                }`}
              >
                <span className="text-2xl mb-2 block">{step.icon}</span>
                <span className="font-display text-sm uppercase tracking-[0.15em] text-foreground">
                  {step.label}
                </span>
              </motion.div>
              {i < flowchartSteps.length - 1 && (
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                  className="my-2"
                >
                  <ArrowDown className="w-5 h-5 text-gold/60" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
