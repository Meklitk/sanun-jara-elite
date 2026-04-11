import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { usePages } from "@/api/pages";
import { Play, Mic, Newspaper, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { MediaItem } from "@/api/types";

const CATEGORY_CONFIG = {
  djelis: { icon: Play, titleKey: "djelisVideos" as const, color: "from-amber-500 to-yellow-600" },
  donsos: { icon: Mic, titleKey: "donsosInterventions" as const, color: "from-red-600 to-red-700" },
  journalists: { icon: Newspaper, titleKey: "journalistsOfManden" as const, color: "from-blue-600 to-blue-700" },
  other: { icon: FileText, titleKey: "culture" as const, color: "from-yellow-600 to-amber-700" },
};

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* ================= MEDIA CARD ================= */

function MediaCard({ item, t }: { item: MediaItem; t: any }) {
  const [play, setPlay] = useState(false);
  const category = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.other;
  const Icon = category.icon;
  const title = t[category.titleKey];

  if (item.type === "video") {
    return (
      <div className="rounded-xl overflow-hidden bg-black/30 border border-white/10">
        {play ? (
          <video src={item.url} controls autoPlay className="w-full aspect-video" />
        ) : (
          <div className="relative aspect-video">
            <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <button
              onClick={() => setPlay(true)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition">
                <Play className="text-black ml-1" />
              </div>
            </button>
          </div>
        )}

        <div className="p-3">
          <p className="text-xs text-gold/70 uppercase">{title}</p>
          <h3 className="text-sm font-semibold line-clamp-2">
            {item.title || "Untitled"}
          </h3>
        </div>
      </div>
    );
  }

  if (item.type === "audio") {
    return (
      <div className="p-4 rounded-xl bg-black/30 border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="text-white" />
          <h3 className="font-semibold">{item.title || "Audio"}</h3>
        </div>
        <audio controls src={item.url} className="w-full" />
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      className="flex items-center gap-3 p-4 rounded-xl bg-black/30 border border-white/10 hover:border-gold/40 transition"
    >
      <FileText />
      <div className="flex-1">
        <h3 className="text-sm font-semibold truncate">
          {item.title || "Document"}
        </h3>
      </div>
      <ExternalLink size={16} />
    </a>
  );
}

/* ================= PAGE ================= */

export default function CulturePage() {
  const { t, localize } = useI18n();
  const { data, isLoading, error } = usePages();

  const page = data?.pages.find((p) => p.key === "culture");
  const paragraphs = splitParagraphs(localize(page?.content) || t.cultureDesc);
  const images = (page?.images ?? []).filter(Boolean);
  const media = (page?.media ?? []).filter((item) => Boolean(item.url?.trim()));

  const featured = images[0];
  const gallery = images.slice(1);
  const videoCount = media.filter((item) => item.type === "video").length;

  const mediaByCategory = media.reduce((acc, item) => {
    const cat = item.category || "other";
    acc[cat] = acc[cat] || [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  /* ================= STATES ================= */

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (error || !page) {
    return <div className="p-10 text-center text-red-500">Failed to load.</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-0">

      {/* HERO */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">
                {t.culturalArchive}
              </div>
              <h1 className="text-4xl font-bold">
                {localize(page.title) || t.culture}
              </h1>

              {paragraphs.map((p, i) => (
                <p key={i} className="text-gray-300 leading-relaxed">
                  {p}
                </p>
              ))}

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="rounded-full border border-gold/15 bg-black/30 px-4 py-2 text-sm text-foreground/80">
                  <span className="font-semibold text-gold">{images.length}</span> {t.images}
                </div>
                <div className="rounded-full border border-gold/15 bg-black/30 px-4 py-2 text-sm text-foreground/80">
                  <span className="font-semibold text-gold">{videoCount}</span> {t.videos}
                </div>
              </div>
            </div>

            {featured && (
              <img
                src={featured}
                className="rounded-2xl object-cover w-full h-[350px]"
              />
            )}
          </div>
        </div>
      </section>

      {/* GALLERY - FULL WIDTH */}
      {gallery.length > 0 && (
        <section className="w-full">
          <div className="px-4 max-w-6xl mx-auto mb-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">{t.gallery}</h2>
              <span className="rounded-full border border-gold/15 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold/80">
                {gallery.length} {t.image}{gallery.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                className="relative aspect-square overflow-hidden group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* MEDIA */}
      {media.length > 0 && (
        <section className="px-4 py-12 space-y-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-semibold">{t.videosAndMedia}</h2>
              <span className="rounded-full border border-gold/15 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold/80">
                {media.length} {t.item}{media.length === 1 ? "" : "s"}
              </span>
            </div>
            {Object.entries(mediaByCategory).map(([cat, items]) => {
              const config =
                CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG] ||
                CATEGORY_CONFIG.other;
              const catTitle = t[config.titleKey];

              return (
                <div key={cat} className="space-y-4 mb-10">
                  <h2 className="text-xl font-semibold">{catTitle}</h2>

                  <div className="grid md:grid-cols-3 gap-4">
                    {items.map((item, i) => (
                      <MediaCard key={i} item={item} t={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EMPTY */}
      {media.length === 0 && gallery.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          {t.mediaGalleryComingSoon}
        </div>
      )}
    </div>
  );
}
