import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const timelineEvents = {
  en: [
    { year: "3000 B.C.", title: "Arrival of Mandenkas", side: "right" as const },
    { year: "980 A.D.", title: "First University in the World", side: "left" as const },
    { year: "1236 A.D.", title: "World's first constitution of human rights, abolished slavery", side: "right" as const },
    { year: "1312 A.D.", title: "Discovery of America", side: "left" as const },
    { year: "1324 A.D.", title: "The richest man in history", side: "right" as const },
    { year: "1351 A.D.", title: "Named most honest people on earth", side: "left" as const },
    { year: "1455 A.D.", title: "Manden wins war against Portugal", side: "right" as const },
    { year: "2020 A.D.", title: "Return of the Empire", side: "left" as const },
    { year: "2023 A.D.", title: "Creation of Manden Calendar", side: "right" as const },
  ],
  fr: [
    { year: "3000 av. J.-C.", title: "Arrivée des Mandénkas", side: "right" as const },
    { year: "980 apr. J.-C.", title: "Première université au monde", side: "left" as const },
    { year: "1236 apr. J.-C.", title: "Première constitution des droits de l'homme, abolition de l'esclavage", side: "right" as const },
    { year: "1312 apr. J.-C.", title: "Découverte de l'Amérique", side: "left" as const },
    { year: "1324 apr. J.-C.", title: "L'homme le plus riche de l'histoire", side: "right" as const },
    { year: "1351 apr. J.-C.", title: "Nommé peuple le plus honnête de la terre", side: "left" as const },
    { year: "1455 apr. J.-C.", title: "Le Manden remporte la guerre contre le Portugal", side: "right" as const },
    { year: "2020 apr. J.-C.", title: "Retour de l'Empire", side: "left" as const },
    { year: "2023 apr. J.-C.", title: "Création du calendrier Manden", side: "right" as const },
  ],
};

export default function HistoryPage() {
  const { t, lang } = useI18n();
  const events = timelineEvents[lang];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <p className="text-sm uppercase tracking-[0.4em] text-gold mb-3 font-display">
          {t.historySubtitle}
        </p>
        <h1 className="text-5xl font-display font-bold gold-gradient-text">
          {t.historyTitle}
        </h1>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Central line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent" />

        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: event.side === "left" ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className={`relative flex items-center mb-12 ${
              event.side === "left" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Content card */}
            <div className={`w-5/12 ${event.side === "left" ? "text-right pl-8" : "pr-8"}`}>
              <div className="glass-panel gold-border-glow rounded-xl p-6 hover:bg-muted/30 transition-all duration-500 group">
                <span className="text-xs font-display uppercase tracking-[0.2em] text-gold group-hover:text-gold-light transition-colors">
                  {event.year}
                </span>
                <p className="mt-2 text-foreground font-body leading-relaxed">
                  {event.title}
                </p>
              </div>
            </div>

            {/* Center dot */}
            <div className="w-2/12 flex justify-center">
              <div className="w-4 h-4 rounded-full gold-gradient-bg shadow-lg shadow-gold/30 relative z-10" />
            </div>

            {/* Empty space */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
