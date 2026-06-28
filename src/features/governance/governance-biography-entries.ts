import type { Page } from "@/api/types";
import { biographies, resolveBiographySlug, type BiographySlug } from "@/data/biographies";
import { resolveGovernanceData } from "@/features/governance/governance-content";
import { extractBiographySlug } from "@/features/governance/governance-links";

export type GovernanceBiographyEntry = {
  slug: string;
  nameFR: string;
  nameEN: string;
  roleFR: string;
  roleEN: string;
};

type RoleLabels = {
  chiefdom: string;
  mandenMansa: string;
  mandenDjeliba: string;
  mandenMory: string;
  govName: string;
  constitution: string;
  branch: string;
};

function readLocalized(value: Partial<{ en?: string; fr?: string }> | undefined) {
  return {
    fr: value?.fr?.trim() || value?.en?.trim() || "",
    en: value?.en?.trim() || value?.fr?.trim() || "",
  };
}

function upsertEntry(
  map: Map<string, GovernanceBiographyEntry>,
  rawSlug: string,
  entry: Omit<GovernanceBiographyEntry, "slug">
) {
  const slug = resolveBiographySlug(rawSlug) ?? rawSlug.trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return;

  const known = biographies[slug as BiographySlug];
  const existing = map.get(slug);

  map.set(slug, {
    slug,
    nameFR: entry.nameFR || known?.nameFR || existing?.nameFR || slug,
    nameEN: entry.nameEN || known?.nameEN || existing?.nameEN || slug,
    roleFR: entry.roleFR || existing?.roleFR || "",
    roleEN: entry.roleEN || existing?.roleEN || "",
  });
}

export function collectGovernanceBiographyEntries(
  page: Page | undefined,
  roleLabels: RoleLabels
): GovernanceBiographyEntry[] {
  const map = new Map<string, GovernanceBiographyEntry>();

  for (const [slug, entry] of Object.entries(biographies)) {
    upsertEntry(map, slug, {
      nameFR: entry.nameFR,
      nameEN: entry.nameEN,
      roleFR: "",
      roleEN: "",
    });
  }

  const governance = resolveGovernanceData(page);

  const governanceRows: Array<{
    url?: string;
    name: Partial<{ en?: string; fr?: string }>;
    roleFR: string;
    roleEN: string;
  }> = [
    { url: governance.chiefdomUrl, name: governance.chiefdom, roleFR: roleLabels.chiefdom, roleEN: roleLabels.chiefdom },
    { url: governance.mandenMansaUrl, name: governance.mandenMansa, roleFR: roleLabels.mandenMansa, roleEN: roleLabels.mandenMansa },
    { url: governance.mandenDjelibaUrl, name: governance.mandenDjeliba, roleFR: roleLabels.mandenDjeliba, roleEN: roleLabels.mandenDjeliba },
    { url: governance.mandenMoryUrl, name: governance.mandenMory, roleFR: roleLabels.mandenMory, roleEN: roleLabels.mandenMory },
    { url: governance.governmentNameUrl, name: governance.governmentName, roleFR: roleLabels.govName, roleEN: roleLabels.govName },
    { url: governance.constitutionUrl, name: governance.constitution, roleFR: roleLabels.constitution, roleEN: roleLabels.constitution },
    ...governance.branches.map((branch) => ({
      url: branch.url,
      name: branch.name,
      roleFR: roleLabels.branch,
      roleEN: roleLabels.branch,
    })),
  ];

  for (const row of governanceRows) {
    const slug = extractBiographySlug(row.url);
    if (!slug) continue;
    const name = readLocalized(row.name);
    upsertEntry(map, slug, {
      nameFR: name.fr,
      nameEN: name.en,
      roleFR: row.roleFR,
      roleEN: row.roleEN,
    });
  }

  for (const bio of page?.biographies ?? []) {
    if (!bio.slug?.trim()) continue;
    const name = readLocalized(bio.name);
    const role = readLocalized(bio.role);
    upsertEntry(map, bio.slug, {
      nameFR: name.fr,
      nameEN: name.en,
      roleFR: role.fr,
      roleEN: role.en,
    });
  }

  return [...map.values()].sort((a, b) => a.nameEN.localeCompare(b.nameEN));
}

export function mergeBiographyProfileSlugs(
  entries: GovernanceBiographyEntry[],
  profileSlugs: string[]
): GovernanceBiographyEntry[] {
  const map = new Map(entries.map((entry) => [entry.slug, entry]));

  for (const slug of profileSlugs) {
    if (!slug || map.has(slug)) continue;
    const known = biographies[slug as BiographySlug];
    map.set(slug, {
      slug,
      nameFR: known?.nameFR ?? slug,
      nameEN: known?.nameEN ?? slug,
      roleFR: "",
      roleEN: "",
    });
  }

  return [...map.values()].sort((a, b) => a.nameEN.localeCompare(b.nameEN));
}
