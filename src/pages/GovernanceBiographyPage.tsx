import { ArrowLeft, Landmark, ScrollText, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useI18n } from "@/lib/i18n";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import { resolveGovernanceData } from "@/features/governance/governance-content";
import { extractBiographySlug } from "@/features/governance/governance-links";

type BiographyEntry = {
  slug: string;
  name: string;
  role: string;
  kind: "person" | "institution";
  summary: string;
  note: string;
  meta: Array<{ label: string; value: string }>;
};

export default function GovernanceBiographyPage() {
  const { slug = "" } = useParams();
  const { lang, t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("governance");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const governance = resolveGovernanceData(page);
  const governmentName = localize(governance.governmentName) || title || "Manden Empire";
  const constitution = localize(governance.constitution);
  const overviewParagraphs = splitParagraphs(content);
  const governanceOverview =
    overviewParagraphs[0] ||
    (lang === "fr"
      ? "La structure de gouvernance du Manden combine la légitimité ancestrale, l'ordre institutionnel et la responsabilité publique."
      : "The governance structure of Manden combines ancestral legitimacy, institutional order, and public stewardship.");
  const biographyReadyNote =
    lang === "fr"
      ? "Cette page biographique est prête à accueillir des notes de leadership, des références historiques et un contexte public à mesure que les éléments sont préparés."
      : "This biography page is ready for leadership notes, historical references, and public background as they are prepared.";
  const institutionReadyNote =
    lang === "fr"
      ? "Ce profil institutionnel peut être enrichi avec l'historique, le mandat et les références publiques de cette institution."
      : "This institutional profile can be expanded with founding context, constitutional background, and public references.";
  const branchReadyNote =
    lang === "fr"
      ? "Ce profil institutionnel peut être enrichi avec un mandat plus complet, des notes historiques et des sources publiques complémentaires."
      : "This institutional profile can be expanded with a fuller mandate, historical notes, and supporting public sources.";

  function officeSummary(name: string, role: string) {
    return lang === "fr"
      ? `${name} est présenté sur la page publique de gouvernance comme ${role} du ${governmentName}.`
      : `${name} is listed on the public governance page as the ${role} of ${governmentName}.`;
  }

  function institutionSummary(name: string, role: string) {
    return lang === "fr"
      ? `${name} est présenté sur la page de gouvernance comme une institution rattachée à ${role} au sein de ${governmentName}.`
      : `${name} is presented on the governance page as an institution connected to ${role} within ${governmentName}.`;
  }

  function branchSummary(name: string) {
    return lang === "fr"
      ? `${name} apparaît sur la page de gouvernance comme l'une des branches du gouvernement au sein de ${governmentName}.`
      : `${name} appears on the governance page as one of the branches of government within ${governmentName}.`;
  }

  function officePresenceNote(name: string, role: string) {
    return lang === "fr"
      ? `${name} est actuellement affiché dans la fonction de ${role} dans la présentation publique de la gouvernance de ${governmentName}.`
      : `${name} is shown in the office of ${role} within the current governance presentation of ${governmentName}.`;
  }

  function institutionPresenceNote(name: string) {
    return lang === "fr"
      ? `${name} est présenté comme un élément de la structure institutionnelle affichée sur la page de gouvernance de ${governmentName}.`
      : `${name} is shown as part of the institutional structure presented on the governance page for ${governmentName}.`;
  }

  const entries: BiographyEntry[] = [
    {
      slug: extractBiographySlug(governance.chiefdomUrl),
      name: localize(governance.chiefdom),
      role: t.chiefdom,
      kind: "institution",
      summary: institutionSummary(localize(governance.chiefdom), t.chiefdom),
      note:
        lang === "fr"
          ? `Cette page peut accueillir l'histoire institutionnelle, le mandat et le dossier public associés à la ${t.chiefdom.toLowerCase()}.`
          : `This page can hold the institutional history, mandate, and public record attached to the ${t.chiefdom.toLowerCase()}.`,
      meta: [
        { label: t.role, value: t.chiefdom },
        { label: t.category, value: t.institution },
        { label: t.constitution, value: constitution || t.linkUnavailable },
      ],
    },
    {
      slug: extractBiographySlug(governance.mandenMansaUrl),
      name: localize(governance.mandenMansa),
      role: t.mandenMansa,
      kind: "person",
      summary: officeSummary(localize(governance.mandenMansa), t.mandenMansa),
      note: biographyReadyNote,
      meta: [
        { label: t.role, value: t.mandenMansa },
        { label: t.category, value: t.person },
        { label: t.govName, value: governmentName },
      ],
    },
    {
      slug: extractBiographySlug(governance.mandenDjelibaUrl),
      name: localize(governance.mandenDjeliba),
      role: t.mandenDjeliba,
      kind: "person",
      summary: officeSummary(localize(governance.mandenDjeliba), t.mandenDjeliba),
      note: biographyReadyNote,
      meta: [
        { label: t.role, value: t.mandenDjeliba },
        { label: t.category, value: t.person },
        { label: t.govName, value: governmentName },
      ],
    },
    {
      slug: extractBiographySlug(governance.mandenMoryUrl),
      name: localize(governance.mandenMory),
      role: t.mandenMory,
      kind: "person",
      summary: officeSummary(localize(governance.mandenMory), t.mandenMory),
      note: biographyReadyNote,
      meta: [
        { label: t.role, value: t.mandenMory },
        { label: t.category, value: t.person },
        { label: t.govName, value: governmentName },
      ],
    },
    {
      slug: extractBiographySlug(governance.governmentNameUrl),
      name: governmentName,
      role: t.govName,
      kind: "institution",
      summary:
        lang === "fr"
          ? `${governmentName} apparaît sur la page de gouvernance comme le nom du gouvernement et le cadre institutionnel des fonctions qui y sont présentées.`
          : `${governmentName} appears on the governance page as the name of government and the institutional frame for the offices listed there.`,
      note: institutionReadyNote,
      meta: [
        { label: t.role, value: t.govName },
        { label: t.category, value: t.institution },
        { label: t.constitution, value: constitution || t.linkUnavailable },
      ],
    },
    {
      slug: extractBiographySlug(governance.constitutionUrl),
      name: constitution,
      role: t.constitution,
      kind: "institution",
      summary:
        lang === "fr"
          ? `${constitution} est présenté sur la page de gouvernance comme le cadre constitutionnel soutenant ${governmentName}.`
          : `${constitution} is displayed on the governance page as the constitutional framework supporting ${governmentName}.`,
      note:
        lang === "fr"
          ? "Cette page peut accueillir l'histoire constitutionnelle, les principes majeurs et les notes de référence publique associées à ce document."
          : "This page can be used for the constitutional history, key principles, and public reference notes associated with this document.",
      meta: [
        { label: t.role, value: t.constitution },
        { label: t.category, value: t.institution },
        { label: t.govName, value: governmentName },
      ],
    },
    ...governance.branches.map((branch) => ({
      slug: extractBiographySlug(branch.url),
      name: localize(branch.name),
      role: t.branch,
      kind: "institution" as const,
      summary: branchSummary(localize(branch.name)),
      note: branchReadyNote,
      meta: [
        { label: t.role, value: t.branch },
        { label: t.mainPowers, value: localize(branch.powers) || t.linkUnavailable },
        { label: t.selection, value: localize(branch.selection) || t.linkUnavailable },
      ],
    })),
  ].filter((entry) => entry.slug && entry.name);

  const entry = entries.find((item) => item.slug === slug);

  if (!entry) return <PageNotFoundState />;

  const paragraphs = [
    entry.summary,
    governanceOverview,
    entry.kind === "person"
      ? officePresenceNote(entry.name, entry.role)
      : institutionPresenceNote(entry.name),
    entry.note,
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.94),rgba(39,25,8,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <Link
          to="/governance"
          className="inline-flex items-center gap-2 text-sm text-gold/82 transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.returnToGovernance}</span>
        </Link>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gold/82">
            {entry.kind === "person" ? t.person : t.institution}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-foreground/76">
            {entry.role}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-bold gold-gradient-text sm:text-5xl">{entry.name}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/76">{entry.summary}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-[1.8rem] border border-gold/15 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
              {entry.kind === "person" ? <ShieldCheck className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.profileNotes}</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">{entry.role}</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-base leading-8 text-foreground/76">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-[1.6rem] border border-gold/15 bg-black/25 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                <ScrollText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.overview}</p>
                <p className="mt-1 text-sm text-foreground/72">{governmentName}</p>
              </div>
            </div>
          </div>

          {entry.meta.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-[1.6rem] border border-gold/15 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{item.label}</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">{item.value}</p>
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
}
