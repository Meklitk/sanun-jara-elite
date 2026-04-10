import { motion } from "framer-motion";

import { useI18n } from "@/lib/i18n";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import {
  resolveGovernanceData,
  resolveGovernanceImages,
  resolveGovernanceSources,
} from "@/features/governance/governance-content";

export default function GovernancePage() {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("governance");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const governance = resolveGovernanceData(page);
  const sources = resolveGovernanceSources(page);
  const [flagImage, emblemImage] = resolveGovernanceImages(page);
  const offices = [
    { label: t.chiefdom, value: localize(governance.chiefdom) },
    { label: t.mandenMansa, value: localize(governance.mandenMansa) },
    { label: t.mandenDjeliba, value: localize(governance.mandenDjeliba) },
    { label: t.mandenMory, value: localize(governance.mandenMory) },
    { label: t.govName, value: localize(governance.governmentName) },
    { label: t.constitution, value: localize(governance.constitution) },
    { label: t.govType, value: localize(governance.governmentType) },
  ].filter((item) => item.value);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.95),rgba(35,23,9,0.88))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_300px]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.34em] text-gold/72">{localize(governance.governmentName) || "Manden Empire"}</p>
              <h1 className="text-4xl font-bold gold-gradient-text sm:text-5xl">{title || t.governance}</h1>
              {paragraphs.length ? (
                <div className="space-y-4 text-base leading-8 text-foreground/76">
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[1.6rem] border border-gold/12 bg-black/28 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
              <div className="grid gap-4 md:grid-cols-2">
                {offices.map((item) => (
                  <div key={item.label} className="rounded-[1.15rem] border border-white/6 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-gold/68">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="overflow-hidden rounded-[1rem] border border-gold/15 bg-white/95 p-2 shadow-[0_14px_45px_rgba(0,0,0,0.18)]">
                <img src={flagImage} alt={localize(governance.governmentName) || title} className="h-14 w-24 object-contain" />
              </div>
            </div>

           
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold/15 bg-black/25 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.corruptionIndex}</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-gold/70 border-b-gold/20 border-l-gold/20 bg-black/20 text-2xl font-display font-bold text-foreground">
                  {governance.corruptionIndex}
                </div>
                <p className="text-sm leading-7 text-foreground/72">{localize(governance.corruptionSummary)}</p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.05 }}
              className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.riskIndex}</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.2rem] bg-gold/85 text-4xl font-display font-bold text-black">
                  {governance.riskIndex}
                </div>
                <p className="text-sm leading-7 text-foreground/72">{localize(governance.riskSummary)}</p>
              </div>
            </motion.article>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
              <h2 className="text-lg font-semibold text-foreground">{t.branchesTitle}</h2>
              <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-gold/12">
                <table className="min-w-full divide-y divide-gold/10 text-left text-sm">
                  <thead className="bg-gold/10 text-gold">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t.branch}</th>
                      <th className="px-4 py-3 font-semibold">{t.mainPowers}</th>
                      <th className="px-4 py-3 font-semibold">{t.selection}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10 bg-black/20 text-foreground/78">
                    {governance.branches.map((branch, index) => (
                      <tr key={`${branch.name.en ?? "branch"}-${index}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{localize(branch.name)}</td>
                        <td className="px-4 py-3">{localize(branch.powers)}</td>
                        <td className="px-4 py-3">{localize(branch.selection)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
              <div className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.taxInfo}</p>
                <p className="mt-3 text-base font-semibold text-foreground">{localize(governance.taxInformation)}</p>
              </div>

              <div className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.phone}</p>
                <p className="mt-3 text-base font-semibold text-foreground">{governance.phone}</p>
              </div>
            </div>

            {sources.length ? (
              <div className="rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.sources}</p>
                <ol className="mt-4 space-y-3 text-sm leading-7 text-foreground/74">
                  {sources.map((source, index) => {
                    const label = localize(source.label) || source.url;
                    if (!label) return null;

                    return (
                      <li key={`${label}-${index}`} className="flex gap-3">
                        <span className="font-display text-gold">{index + 1}.</span>
                        {source.url ? (
                          <a href={source.url} target="_blank" rel="noreferrer" className="transition hover:text-gold">
                            {label}
                          </a>
                        ) : (
                          <span>{label}</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
