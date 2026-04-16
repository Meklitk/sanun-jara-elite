import { ArrowLeft, Landmark, ScrollText, ShieldCheck, ImageIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useI18n } from "@/lib/i18n";
import type { BiographyItem } from "@/api/types";
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
  content: string;
  images: string[];
  meta: Array<{ label: string; value: string }>;
};

function getBiographyFromCustomData(
  slug: string,
  biographies: BiographyItem[] | undefined,
  localize: (value: Partial<{ en: string; fr?: string }> | undefined) => string
): Partial<BiographyEntry> | null {
  if (!biographies) return null;
  const bio = biographies.find((b) => b.slug === slug);
  if (!bio) return null;

  return {
    name: localize(bio.name),
    role: localize(bio.role),
    kind: bio.kind,
    content: localize(bio.content),
    images: bio.images ?? [],
    meta: (bio.meta ?? []).map((m) => ({
      label: localize(m.label),
      value: localize(m.value),
    })),
  };
}

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

  // Check for custom biography data
  const customBio = getBiographyFromCustomData(slug, page.biographies, localize);
  const hasCustomContent = Boolean(customBio?.content?.trim());
  const hasCustomImages = (customBio?.images?.length ?? 0) > 0;

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

  function defaultReadyNote(kind: "person" | "institution") {
    if (kind === "person") {
      return lang === "fr"
        ? "Cette page biographique est prête à accueillir des notes de leadership, des références historiques et un contexte public à mesure que les éléments sont préparés."
        : "This biography page is ready for leadership notes, historical references, and public background as they are prepared.";
    }
    return lang === "fr"
      ? "Ce profil institutionnel peut être enrichi avec l'historique, le mandat et les références publiques de cette institution."
      : "This institutional profile can be expanded with founding context, constitutional background, and public references.";
  }

  // Build entries from governance data (fallback for entries without custom biography)
  const baseEntries: BiographyEntry[] = [
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
      content: "",
      images: [],
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
      note: defaultReadyNote("person"),
      content: "",
      images: [],
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
      note: defaultReadyNote("person"),
      content: "",
      images: [],
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
      note: defaultReadyNote("person"),
      content: "",
      images: [],
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
      note: defaultReadyNote("institution"),
      content: "",
      images: [],
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
      content: "",
      images: [],
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
      note:
        lang === "fr"
          ? "Ce profil institutionnel peut être enrichi avec un mandat plus complet, des notes historiques et des sources publiques complémentaires."
          : "This institutional profile can be expanded with a fuller mandate, historical notes, and supporting public sources.",
      content: "",
      images: [] as string[],
      meta: [
        { label: t.role, value: t.branch },
        { label: t.mainPowers, value: localize(branch.powers) || t.linkUnavailable },
        { label: t.selection, value: localize(branch.selection) || t.linkUnavailable },
      ],
    })),
  ].filter((entry) => entry.slug && entry.name);

  // Also include custom biographies that may not be in governance data
  const customSlugs = (page.biographies ?? []).map((b) => b.slug).filter(Boolean);
  const customOnlyEntries = (page.biographies ?? [])
    .filter((b) => !baseEntries.some((e) => e.slug === b.slug))
    .map((b) => ({
      slug: b.slug,
      name: localize(b.name),
      role: localize(b.role),
      kind: b.kind as "person" | "institution",
      summary:
        b.kind === "person"
          ? officeSummary(localize(b.name), localize(b.role))
          : institutionSummary(localize(b.name), localize(b.role)),
      note: defaultReadyNote(b.kind),
      content: localize(b.content),
      images: b.images ?? [],
      meta: (b.meta ?? []).map((m) => ({
        label: localize(m.label),
        value: localize(m.value),
      })),
    }));

  const allEntries = [...baseEntries, ...customOnlyEntries];
  const baseEntry = allEntries.find((item) => item.slug === slug);

  if (!baseEntry) return <PageNotFoundState />;

  // Merge with custom data if available
  const entry: BiographyEntry = {
    ...baseEntry,
    ...(customBio?.name && { name: customBio.name }),
    ...(customBio?.role && { role: customBio.role }),
    ...(customBio?.kind && { kind: customBio.kind }),
    ...(customBio?.content && { content: customBio.content }),
    ...(customBio?.images?.length && { images: customBio.images }),
    ...(customBio?.meta?.length && { meta: customBio.meta }),
  };

  // Build paragraphs - use custom content if available, otherwise use generated content
  const paragraphs = hasCustomContent
    ? splitParagraphs(entry.content)
    : [
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
        <div className="space-y-6">
          {/* Custom Content Article */}
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

          {/* Images Gallery - only show if there are custom images */}
          {hasCustomImages && (
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              className="rounded-[1.8rem] border border-gold/15 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">
                    {lang === "fr" ? "Galerie" : "Gallery"}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    {lang === "fr" ? "Images" : "Images"}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {entry.images.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="overflow-hidden rounded-[1.25rem] border border-gold/15 bg-black/20"
                  >
                    <img
                      src={url}
                      alt={`${entry.name} - ${index + 1}`}
                      className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.article>
          )}
        </div>

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

          {/* Category badge */}
          <div className="rounded-[1.6rem] border border-gold/15 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.category}</p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              {entry.kind === "person" ? t.person : t.institution}
            </p>
          </div>

          {entry.meta.map((item, index) => (
            <motion.div
              key={`${item.label}-${item.value}-${index}`}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[1.6rem] border border-gold/15 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{item.label}</p>
              <p className="mt-3 text-sm font-semibold tracking-[0.02em] text-foreground">{item.value}</p>
            </motion.div>
          ))}
        </aside>
      </section>
    </div>
  );
}
