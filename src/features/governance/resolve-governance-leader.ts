import type { Page } from "@/api/types";
import type { TranslationKey } from "@/lib/i18n";
import { resolveGovernanceData } from "@/features/governance/governance-content";
import { extractBiographySlug } from "@/features/governance/governance-links";
import { biographies, biographySlugAliases, resolveBiographySlug } from "@/data/biographies";

export type GovernanceLeader = {
  slug: string;
  name: string;
  role: string;
  kind: "person" | "institution";
};

type Localize = (value: Partial<{ en: string; fr?: string }> | undefined) => string;
type Labels = Record<TranslationKey, string>;

function normalizeSlug(slug: string) {
  const alias = biographySlugAliases[slug];
  return alias ?? slug;
}

export function resolveGovernanceLeaderBySlug(
  slug: string,
  page: Page | undefined,
  localize: Localize,
  labels: Labels
): GovernanceLeader | null {
  if (!slug.trim()) return null;

  const canonicalSlug = normalizeSlug(slug);
  const governance = resolveGovernanceData(page);
  const governmentName = localize(governance.governmentName) || "Manden Empire";

  const entries: GovernanceLeader[] = [
    {
      slug: extractBiographySlug(governance.chiefdomUrl),
      name: localize(governance.chiefdom),
      role: labels.chiefdom,
      kind: "institution",
    },
    {
      slug: extractBiographySlug(governance.mandenMansaUrl),
      name: localize(governance.mandenMansa),
      role: labels.mandenMansa,
      kind: "person",
    },
    {
      slug: extractBiographySlug(governance.mandenDjelibaUrl),
      name: localize(governance.mandenDjeliba),
      role: labels.mandenDjeliba,
      kind: "person",
    },
    {
      slug: extractBiographySlug(governance.mandenMoryUrl),
      name: localize(governance.mandenMory),
      role: labels.mandenMory,
      kind: "person",
    },
    {
      slug: extractBiographySlug(governance.governmentNameUrl),
      name: governmentName,
      role: labels.govName,
      kind: "institution",
    },
    {
      slug: extractBiographySlug(governance.constitutionUrl),
      name: localize(governance.constitution),
      role: labels.constitution,
      kind: "institution",
    },
    ...governance.branches.map((branch) => {
      const branchSlug = extractBiographySlug(branch.url);
      if (branchSlug === "legislative-committee") {
        const sitan = biographies["sitan-foune-diakite"];
        return {
          slug: "legislative-committee",
          name: localize(
            sitan ? { en: sitan.nameEN, fr: sitan.nameFR } : branch.name
          ),
          role: labels.legislativeCommittee,
          kind: "person" as const,
        };
      }

      return {
        slug: branchSlug,
        name: localize(branch.name),
        role: labels.branch,
        kind: "institution" as const,
      };
    }),
    ...(page?.biographies ?? []).map((bio) => ({
      slug: bio.slug,
      name: localize(bio.name),
      role: localize(bio.role),
      kind: bio.kind,
    })),
  ].filter((entry) => entry.slug && entry.name);

  const match = entries.find(
    (entry) =>
      entry.slug === slug ||
      entry.slug === canonicalSlug ||
      normalizeSlug(entry.slug) === canonicalSlug ||
      (slug === "legislative-committee" && entry.slug === "legislative-committee")
  );

  if (match) return match;

  const biographySlug = resolveBiographySlug(canonicalSlug);
  if (biographySlug && biographySlug !== "sitan-foune-diakite") {
    const entry = biographies[biographySlug];
    return {
      slug: biographySlug,
      name: entry.nameEN,
      role: labels.mandenMansa,
      kind: "person",
    };
  }

  return null;
}
