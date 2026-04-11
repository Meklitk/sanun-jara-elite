import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
import { isExternalUrl, isInternalAppPath } from "@/features/governance/governance-links";
import SiteCoatOfArms from "@/components/SiteCoatOfArms";

function LinkedValue({
  value,
  url,
  className,
}: {
  value: string;
  url?: string;
  className: string;
}) {
  if (!url?.trim()) {
    return <span className={className}>{value}</span>;
  }

  if (isInternalAppPath(url)) {
    return (
      <Link to={url} className={className}>
        {value}
      </Link>
    );
  }

  return (
    <a href={url} target={isExternalUrl(url) ? "_blank" : undefined} rel={isExternalUrl(url) ? "noreferrer" : undefined} className={className}>
      {value}
    </a>
  );
}

export default function GovernancePage() {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("governance");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const governance = resolveGovernanceData(page);
  const sources = resolveGovernanceSources(page);
  const [flagImage] = resolveGovernanceImages(page);
  const offices = [
    { label: t.chiefdom, value: localize(governance.chiefdom), url: governance.chiefdomUrl },
    { label: t.mandenMansa, value: localize(governance.mandenMansa), url: governance.mandenMansaUrl },
    { label: t.mandenDjeliba, value: localize(governance.mandenDjeliba), url: governance.mandenDjelibaUrl },
    { label: t.mandenMory, value: localize(governance.mandenMory), url: governance.mandenMoryUrl },
    { label: t.govName, value: localize(governance.governmentName), url: governance.governmentNameUrl },
    { label: t.constitution, value: localize(governance.constitution), url: governance.constitutionUrl },
    { label: t.govType, value: localize(governance.governmentType) },
  ].filter((item) => item.value);
  const governmentName = localize(governance.governmentName) || "Manden Empire";

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="rounded-[1.25rem] sm:rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.95),rgba(35,23,9,0.88))] p-4 sm:p-6 sm:p-8 lg:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <div className="grid gap-4 sm:gap-8 xl:grid-cols-[minmax(0,1.2fr)_260px]">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <LinkedValue
                value={governmentName}
                url={governance.governmentNameUrl}
                className="inline-flex text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.34em] text-gold/72 transition hover:text-gold"
              />
              <h1 className="text-2xl sm:text-4xl font-bold gold-gradient-text sm:text-5xl">{title || t.governance}</h1>
              {paragraphs.length ? (
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-7 sm:leading-8 text-foreground/76">
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] sm:rounded-[2.6rem] border border-gold/12 bg-black/28 p-3 sm:p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {offices.map((item) => (
                  <div key={item.label} className="rounded-[1rem] sm:rounded-[1.15rem] border border-white/6 bg-white/[0.03] px-3 sm:px-4 py-2 sm:py-3">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-gold/68">{item.label}</p>
                    <LinkedValue
                      value={item.value}
                      url={item.url}
                      className="mt-1 sm:mt-2 inline-flex text-xs sm:text-sm font-semibold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-foreground transition hover:text-gold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 xl:pt-2">
           

            <div className="flex justify-center xl:justify-end">
              <SiteCoatOfArms />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.25rem] sm:rounded-[2rem] border border-gold/15 bg-black/25 p-4 sm:p-6 sm:p-8 lg:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              className="rounded-[1.25rem] sm:rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-3 sm:p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-gold/72">{t.corruptionIndex}</p>
              <div className="mt-3 sm:mt-5 flex items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full border-[6px] sm:border-[10px] border-gold/70 border-b-gold/20 border-l-gold/20 bg-black/20 text-lg sm:text-2xl font-display font-bold text-foreground">
                  {governance.corruptionIndex}
                </div>
                <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-foreground/72">{localize(governance.corruptionSummary)}</p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.05 }}
              className="rounded-[1.25rem] sm:rounded-[1.6rem] border border-gold/12 bg-white/[0.03] p-3 sm:p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-gold/72">{t.riskIndex}</p>
              <div className="mt-3 sm:mt-5 flex items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-[1rem] sm:rounded-[1.2rem] bg-gold/85 text-2xl sm:text-4xl font-display font-bold text-black">
                  {governance.riskIndex}
                </div>
                <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-foreground/72">{localize(governance.riskSummary)}</p>
              </div>
            </motion.article>
          </div>

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
                      <td className="px-4 py-3 font-medium text-foreground">
                        <LinkedValue
                          value={localize(branch.name)}
                          url={branch.url}
                          className="transition hover:text-gold hover:underline underline-offset-4"
                        />
                      </td>
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
      </section>
    </div>
  );
}
