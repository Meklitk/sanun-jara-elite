import { motion } from "framer-motion";
import { Building2, Image as ImageIcon, Hammer } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";

export default function NianiArchitecturalProjectsPage() {
  const { t, lang, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("niani");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />

  const projects = page.architecturalProjects || [];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.94),rgba(39,25,8,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.niani}</p>
            <h1 className="mt-1 text-4xl font-bold gold-gradient-text sm:text-5xl">{t.architecturalProjects}</h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/76">
          {content || (lang === "fr" ? "Explorez les projets architecturaux de l'Empire Manden." : "Explore the architectural projects of the Manden Empire.")}
        </p>
      </section>

      {projects.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-16 text-center">
          <Building2 className="h-12 w-12 text-gold/40 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {t.noProjectsYet}
          </p>
        </div>
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
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4 text-gold" />
                    <p className="text-xs uppercase tracking-[0.22em] text-gold/70">
                      {t.nianiConceptImages}
                    </p>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {project.conceptImages.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`${localize(project.name)} concept ${idx + 1}`}
                        className="h-48 w-full rounded-xl object-cover border border-gold/10 shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {project.workImages && project.workImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Hammer className="h-4 w-4 text-gold" />
                    <p className="text-xs uppercase tracking-[0.22em] text-gold/70">
                      {t.nianiWorkProgress}
                    </p>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {project.workImages.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`${localize(project.name)} work ${idx + 1}`}
                        className="h-48 w-full rounded-xl object-cover border border-gold/10 shadow-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
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
