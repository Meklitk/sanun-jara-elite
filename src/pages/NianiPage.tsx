import { Building2, Tv, Landmark, Play, Film } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
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
    icon: Landmark,
    titleKey: "institutions" as const,
    descriptionKey: "institutionsDesc" as const,
    accent: "gold" as const,
    path: "/niani/institutions",
  },
  {
    id: "architectural-projects",
    icon: Building2,
    titleKey: "architecturalProjects" as const,
    descriptionKey: "architecturalProjectsDesc" as const,
    accent: "gold" as const,
    path: "/niani/architectural-projects",
  },
  {
    id: "niani-tv",
    icon: Tv,
    titleKey: "nianiTv" as const,
    descriptionKey: "nianiTvDesc" as const,
    accent: "crimson" as const,
    path: "/niani/niani-tv",
  },
];

function VideoCard({ item, index, t }: { item: MediaItem; index: number; t: any }) {
  const [play, setPlay] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-gold/15 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
    >
      <div className="relative aspect-video overflow-hidden">
        {play ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <video
              src={item.url}
              className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
              muted
            />
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

function NianiTvSection({ page, t }: { page: any; t: any }) {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const videos = (page?.media || []).filter((item: MediaItem) => item.type === "video");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] space-y-8 sm:space-y-12 pb-12 sm:pb-16">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-4 sm:pt-10">
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-gold/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-black/50 to-black" />
          
          <div className="relative px-4 sm:px-10 py-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="flex max-w-4xl flex-col justify-center items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 sm:mb-6"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient-bg">
                  <Tv className="h-8 w-8 text-black" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 sm:mb-6 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-gold/80"
              >
                {t.niani}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl sm:text-5xl font-display font-bold leading-tight text-gold drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] md:text-7xl"
              >
                {t.nianiTv}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-7 text-foreground/70"
              >
                {t.nianiTvDesc}
              </motion.p>
            </div>
          </div>
        </div>
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
            <Film className="h-12 w-12 text-gold/30 mb-4" />
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
        icon: definition.icon,
        title: t[definition.titleKey],
        description: t[definition.descriptionKey],
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href: definition.path,
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
