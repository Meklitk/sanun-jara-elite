import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ImageLightbox from "@/components/ImageLightbox";
import SectionEmojiHeader from "@/components/SectionEmojiHeader";
import SectionEmptyState from "@/components/SectionEmptyState";
import { SECTION_EMOJIS } from "@/lib/section-emojis";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";

export default function NianiInstitutionsPage() {
  const { t, lang, localize } = useI18n();
  const { page, isLoading, error } = useCmsPage("niani");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const institutions = page.institutions || [];

  return (
    <div className="space-y-8">
      <SectionEmojiHeader
        emoji={SECTION_EMOJIS.institutions}
        eyebrow={t.niani}
        title={t.institutions}
        description={t.institutionsDesc}
      />

      {institutions.length === 0 ? (
        <SectionEmptyState
          message={
            lang === "fr"
              ? "Les institutions seront affichées ici une fois ajoutées depuis le tableau de bord administrateur."
              : "Institutions will appear here once added from the admin dashboard."
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {institutions.map((institution, index) => (
            <motion.div
              key={institution.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[1.8rem] border border-gold/15 bg-black/25 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
            >
              <h2 className="text-xl font-semibold text-foreground mb-3">
                {localize(institution.name)}
              </h2>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                {localize(institution.description)}
              </p>

              {institution.images && institution.images.length > 0 ? (
                <div className="mb-4">
                  <div className="grid gap-2 grid-cols-2">
                    {institution.images.map((img, idx) => (
                      <ImageLightbox
                        key={idx}
                        src={img}
                        alt={`${localize(institution.name)} ${idx + 1}`}
                        className="h-32 w-full rounded-lg object-cover border border-gold/10"
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {institution.videos && institution.videos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/70 flex items-center gap-2">
                    <Play className="h-3 w-3" />
                    {t.nianiVideos}
                  </p>
                  <div className="space-y-2">
                    {institution.videos.map((video, idx) => (
                      <a
                        key={idx}
                        href={video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-gold/80 hover:text-gold transition"
                      >
                        {video}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
