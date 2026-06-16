import { motion } from "framer-motion";
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

export default function NianiArchitecturalProjectsPage() {
  const { t, lang, localize } = useI18n();
  const { page, isLoading, error } = useCmsPage("niani");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const projects = page.architecturalProjects || [];

  return (
    <div className="space-y-8">
      <SectionEmojiHeader
        emoji={SECTION_EMOJIS["architectural-projects"]}
        eyebrow={t.niani}
        title={t.architecturalProjects}
        description={t.architecturalProjectsDesc}
      />

      {projects.length === 0 ? (
        <SectionEmptyState
          message={
            lang === "fr"
              ? "Les projets architecturaux et leurs images conceptuelles seront affichés ici une fois ajoutés depuis le tableau de bord administrateur."
              : "Architectural projects and concept images will appear here once added from the admin dashboard."
          }
        />
      ) : (
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[1.8rem] border border-gold/15 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                {localize(project.name)}
              </h2>
              <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
                {localize(project.description)}
              </p>

              {project.conceptImages && project.conceptImages.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold/70">
                    {t.nianiConceptImages}
                  </p>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {project.conceptImages.map((img, idx) => (
                      <ImageLightbox
                        key={idx}
                        src={img}
                        alt={`${localize(project.name)} concept ${idx + 1}`}
                        className="h-48 w-full rounded-xl object-cover border border-gold/10 shadow-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {project.workImages && project.workImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span aria-hidden>{SECTION_EMOJIS["architectural-projects"]}</span>
                    <p className="text-xs uppercase tracking-[0.22em] text-gold/70">
                      {t.nianiWorkProgress}
                    </p>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {project.workImages.map((img, idx) => (
                      <ImageLightbox
                        key={idx}
                        src={img}
                        alt={`${localize(project.name)} work ${idx + 1}`}
                        className="h-48 w-full rounded-xl object-cover border border-gold/10 shadow-lg"
                      />
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
