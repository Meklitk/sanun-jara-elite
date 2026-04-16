import { motion } from "framer-motion";
import { Landmark, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";

export default function NianiInstitutionsPage() {
  const { t, lang, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("niani");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />

  const institutions = page.institutions || [];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.94),rgba(39,25,8,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.niani}</p>
            <h1 className="mt-1 text-4xl font-bold gold-gradient-text sm:text-5xl">{t.institutions}</h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/76">
          {content || (lang === "fr" ? "Explorez les institutions de l'Empire Manden." : "Explore the institutions of the Manden Empire.")}
        </p>
      </section>

      {institutions.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-16 text-center">
          <Landmark className="h-12 w-12 text-gold/40 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {t.noInstitutionsYet}
          </p>
        </div>
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
              
              {institution.images && institution.images.length > 0 && (
                <div className="mb-4">
                  <div className="grid gap-2 grid-cols-2">
                    {institution.images.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`${localize(institution.name)} ${idx + 1}`}
                        className="h-32 w-full rounded-lg object-cover border border-gold/10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              )}

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
