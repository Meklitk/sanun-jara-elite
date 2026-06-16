import { Play, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionEmojiHeader from "@/components/SectionEmojiHeader";
import { SECTION_EMOJIS, sectionEmoji } from "@/lib/section-emojis";
import { useCardImages } from "@/lib/card-images-context";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  return null;
}

function getThumbnail(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  return null;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}
import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import { useI18n } from "@/lib/i18n";
import type { MediaItem } from "@/api/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NianiPageProps = {
  section?: "institutions" | "architectural-projects" | "niani-tv";
};

const nianiCardDefinitions = [
  {
    id: "institutions",
    titleKey: "institutions" as const,
    descriptionKey: "institutionsDesc" as const,
    accent: "gold" as const,
    path: "/niani/institutions",
  },
  {
    id: "architectural-projects",
    titleKey: "architecturalProjects" as const,
    descriptionKey: "architecturalProjectsDesc" as const,
    accent: "gold" as const,
    path: "/niani/architectural-projects",
  },
  {
    id: "niani-tv",
    titleKey: "nianiTv" as const,
    descriptionKey: "nianiTvDesc" as const,
    accent: "crimson" as const,
    path: "/niani/niani-tv",
  },
];

function VideoCard({ item, index, t }: { item: MediaItem; index: number; t: any }) {
  const [play, setPlay] = useState(false);
  const embedUrl = getEmbedUrl(item.url);
  const thumb = getThumbnail(item.url);
  const direct = isDirectVideo(item.url);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-gold/15 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {play ? (
          embedUrl ? (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : direct ? (
            <video src={item.url} controls autoPlay className="h-full w-full object-cover" />
          ) : null
        ) : (
          <>
            {thumb ? (
              <img src={thumb} alt={item.title} className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-black/60 text-4xl" aria-hidden>
                {SECTION_EMOJIS["niani-tv"]}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setPlay(true)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 text-black shadow-[0_0_40px_rgba(255,205,86,0.4)] transition-all hover:scale-110 hover:bg-gold"
              >
                <Play className="h-7 w-7 fill-current" />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground">
          {item.title || `${t.nianiVideos} ${index + 1}`}
        </h3>
      </div>
    </motion.article>
  );
}

const YOUTUBE_CHANNEL_URL = "https://youtu.be/WFnZLcRzfYA";

function NianiTvSection({ page, t }: { page: any; t: any }) {
  const { resolveSection } = useCardImages();
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const videos = (page?.media || []).filter(
    (item: MediaItem) => item.type === "video" && item.category !== "cartoon",
  );
  const cartoons = (page?.media || []).filter(
    (item: MediaItem) => item.type === "video" && item.category === "cartoon",
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] space-y-8 sm:space-y-12 pb-12 sm:pb-16">
      <section className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-4 sm:pt-10">
        <SectionEmojiHeader
          imageUrl={resolveSection("niani-tv")}
          emoji={SECTION_EMOJIS["niani-tv"]}
          imageAlt={t.nianiTv}
          eyebrow={t.niani}
          title={t.nianiTv}
          description={t.nianiTvDesc}
        >
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold transition hover:border-gold/45 hover:bg-gold/15"
          >
            {t.watchYoutubeChannel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </SectionEmojiHeader>
      </section>

      {/* Cartoons */}
      <section className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-black/30 text-4xl">
            {SECTION_EMOJIS.nianiCartoons}
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{t.nianiCartoons}</p>
          <p className="max-w-2xl text-sm leading-7 text-foreground/70">{t.nianiCartoonsDesc}</p>
        </div>

        {cartoons.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {cartoons.map((video: MediaItem, index: number) => (
              <VideoCard key={`cartoon-${video.url}-${index}`} item={video} index={index} t={t} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-gold/20 bg-black/15 px-6 py-12 text-center"
          >
            <span className="mb-4 text-5xl" aria-hidden>{SECTION_EMOJIS.emptyCartoons}</span>
            <p className="text-sm text-muted-foreground">{t.nianiCartoonsEmpty}</p>
          </motion.div>
        )}
      </section>

      {/* Videos Grid */}
      <section className="mx-auto max-w-6xl px-3 sm:px-6">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video: MediaItem, index: number) => (
              <VideoCard key={`${video.url}-${index}`} item={video} index={index} t={t} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-gold/20 bg-black/15 px-6 py-16 text-center"
          >
            <span className="mb-4 text-5xl" aria-hidden>{SECTION_EMOJIS.emptyVideos}</span>
            <p className="text-sm text-muted-foreground">
              No videos yet. Videos will appear here once added from the admin dashboard.
            </p>
          </motion.div>
        )}
      </section>

      {/* Fullscreen Video Dialog */}
      <Dialog
        open={selectedVideo !== null}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="max-w-5xl border-gold/20 bg-black/95 p-0">
          <DialogHeader className="p-4">
            <DialogTitle className="text-gold">
              {selectedVideo?.title || t.nianiTv}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <video
              src={selectedVideo?.url}
              controls
              autoPlay
              className="h-full w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NianiPage({ section }: NianiPageProps) {
  const { t } = useI18n();
  const { resolveSection } = useCardImages();
  const { page, title, content, isLoading, error } = useCmsPage("niani");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  // Show Niani TV video section
  if (section === "niani-tv") {
    return <NianiTvSection page={page} t={t} />;
  }

  const cards = nianiCardDefinitions
    .map((definition) => {
      return {
        id: definition.id,
        title: t[definition.titleKey],
        description: t[definition.descriptionKey],
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href: definition.path,
        imageUrl: resolveSection(definition.id),
        imageAlt: t[definition.titleKey],
        emoji: sectionEmoji(definition.id),
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const filteredCards = section
    ? cards.filter((card) => card.id === section)
    : cards;

  return (
    <UtilityLandingPage
      eyebrow={t.niani}
      title={title || t.niani}
      intro={
        !section
          ? content || "Niani - The heart of the Manden Empire. Explore institutions, architectural projects, and our media channel."
          : ""
      }
      cards={filteredCards}
    />
  );
}
