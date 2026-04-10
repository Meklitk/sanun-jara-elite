import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { usePages } from "@/api/pages";
import { Play, Mic, Newspaper, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { MediaItem } from "@/api/types";

const CATEGORY_CONFIG = {
  djelis: { icon: Play, title: "Djelis Videos", color: "from-amber-500 to-yellow-600" },
  donsos: { icon: Mic, title: "Donsos Interventions", color: "from-red-600 to-red-700" },
  journalists: { icon: Newspaper, title: "Journalists of Manden", color: "from-blue-600 to-blue-700" },
  other: { icon: FileText, title: "Other Media", color: "from-gold to-amber-600" },
};

function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const category = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.other;
  const Icon = category.icon;

  if (item.type === "video") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="glass-panel rounded-xl overflow-hidden hover:border-gold/40 transition-all duration-300 group"
      >
        {isPlaying ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="w-full aspect-video bg-black"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="relative aspect-video bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center">
            <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <button
              onClick={() => setIsPlaying(true)}
              className="relative z-10 w-16 h-16 rounded-full bg-gold/90 hover:bg-gold text-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-gold/30"
            >
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${category.color} flex items-center justify-center`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-gold/80 uppercase tracking-wider">{category.title}</span>
          </div>
          <h3 className="font-display font-semibold text-foreground/90 line-clamp-2">{item.title || "Untitled Video"}</h3>
        </div>
      </motion.div>
    );
  }

  if (item.type === "audio") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="glass-panel rounded-xl p-4 hover:border-gold/40 transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gold/80 uppercase tracking-wider">{category.title}</span>
            <h3 className="font-display font-semibold text-foreground/90">{item.title || "Untitled Audio"}</h3>
          </div>
        </div>
        <audio src={item.url} controls className="w-full" />
      </motion.div>
    );
  }

  // Document
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-xl p-4 hover:border-gold/40 transition-all duration-300 group"
    >
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-gold/80 uppercase tracking-wider">{category.title}</span>
          <h3 className="font-display font-semibold text-foreground/90 truncate">{item.title || "Document"}</h3>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
      </a>
    </motion.div>
  );
}

export default function CulturePage() {
  const { t, localize } = useI18n();
  const pagesQuery = usePages();
  const culturePage = pagesQuery.data?.pages.find((p) => p.key === "culture");
  const media = culturePage?.media ?? [];

  const mediaCategories = [
    { icon: Play, title: t.djelisVideos, desc: t.djelisVideosDesc },
    { icon: Mic, title: t.donsosInterventions, desc: t.donsosInterventionsDesc },
    { icon: Newspaper, title: t.journalistsOfManden, desc: t.journalistsOfMandenDesc },
  ];

  // Group media by category
  const mediaByCategory = media.reduce((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-display font-bold gold-gradient-text mb-4">
          {localize(culturePage?.title) || t.culture}
        </h1>
        <p className="text-lg text-foreground/80 font-body max-w-2xl mx-auto">
          {localize(culturePage?.content) || t.cultureDesc}
        </p>
      </motion.div>

      {/* Category Cards */}
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

      {/* Media Gallery */}
      {media.length > 0 ? (
        <div className="space-y-10">
          {Object.entries(mediaByCategory).map(([category, items]) => {
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.other;
            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    <config.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground/90">{config.title}</h2>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-gold/20 text-gold rounded-full">{items.length}</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item, index) => (
                    <MediaCard key={index} item={item} index={index} />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
}
