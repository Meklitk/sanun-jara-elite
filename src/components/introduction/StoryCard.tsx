import { motion } from "framer-motion";
import type { ReactNode } from "react";

type StoryCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function StoryCard({ children, className = "", delay = 0 }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-[24px] border border-gold/15 bg-[linear-gradient(145deg,rgba(212,175,55,0.07),rgba(5,5,5,0.92))] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:shadow-[0_32px_90px_rgba(212,175,55,0.08)] ${className}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}
