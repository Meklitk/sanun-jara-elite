import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { Heart } from "lucide-react";

const donationAmounts = [10, 25, 50, 100, 250];

export default function EconomyPage() {
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.economyTitle}
        </h1>
        <p className="text-lg text-foreground/80 font-body max-w-2xl mx-auto">
          {t.economyDesc}
        </p>
      </motion.div>

      {/* Donation Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto"
      >
        <div className="glass-panel gold-border-glow rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full crimson-gradient-bg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-foreground" />
            </div>
            <h2 className="font-display text-2xl text-gold mb-2">{t.donationsTitle}</h2>
            <p className="text-sm text-muted-foreground font-body">{t.donationsDesc}</p>
          </div>

          {/* Amount buttons */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {donationAmounts.map((amount) => (
              <motion.button
                key={amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`py-3 rounded-lg font-display text-sm transition-all duration-300 ${
                  selectedAmount === amount
                    ? "gold-gradient-bg text-secondary-foreground font-semibold shadow-lg shadow-gold/20"
                    : "glass-panel text-foreground/70 hover:text-foreground"
                }`}
              >
                ${amount}
              </motion.button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mb-6">
            <input
              type="number"
              placeholder={t.donateAmount}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
          </div>

          {/* Donate button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl crimson-gradient-bg text-foreground font-display uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-opacity shadow-lg shadow-crimson/30"
          >
            {t.donate}
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
