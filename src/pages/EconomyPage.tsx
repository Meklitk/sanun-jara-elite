import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useMemo } from "react";
import { usePages } from "@/api/pages";
import { Card } from "@/components/ui/card";
import type { Page } from "@/api/types";

function Paragraphs({ text }: { text: string }) {
  const parts = text
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {parts.map((p, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="text-lg leading-relaxed text-foreground/80"
        >
          {p}
        </motion.p>
      ))}
    </div>
  );
}

export default function EconomyPage() {
  const { localize } = useI18n();
  const { data, isLoading, error } = usePages();

  const page = useMemo<Page | undefined>(
    () => data?.pages.find((p) => p.key === "economy"),
    [data]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-10 w-1/3 animate-pulse rounded-lg bg-muted/40" />
          <div className="h-40 animate-pulse rounded-2xl bg-muted/20" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="glass-panel p-10 text-center">
          <p className="text-lg text-destructive">
            Failed to load economy information.
          </p>
        </Card>
      </div>
    );
  }

  const title = localize(page.title);
  const content = localize(page.content);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(145deg,rgba(10,10,10,0.95),rgba(40,30,10,0.85))] p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Decorative top line */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-[3px] w-16 rounded-full bg-gradient-to-r from-gold to-transparent" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold/70">
              Financial Services
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold md:text-5xl"
          >
            {title || "Economy"}
          </motion.h1>

          {/* Divider */}
          <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {/* Content */}
          {content && (
            <div className="max-w-3xl">
              <Paragraphs text={content} />
            </div>
          )}

          {/* Bottom glow line */}
          <div className="mt-10 h-[2px] w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </Card>
      </motion.div>
    </div>
  );
}
