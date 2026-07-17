import type { Page } from "@/api/types";
import { biographies, resolveBiographySlug, resolveBiographyStorageSlug, type BiographySlug, biographyPublicSlugOverrides } from "@/data/biographies";
import { resolveGovernanceData } from "@/features/governance/governance-content";
import { extractBiographySlug } from "@/features/governance/governance-links";

export type GovernanceBiographyEntry = {
  slug: string;
  storageSlug: string;
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
  legislativeCommittee: string;
  disciplinaryCommittee: string;
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
  entry: Omit<GovernanceBiographyEntry, "slug" | "storageSlug">
) {
  const trimmed = rawSlug.trim();
  if (!trimmed || !/^[a-z0-9-]+$/.test(trimmed)) return;

  const storageSlug = resolveBiographyStorageSlug(trimmed) ?? trimmed;
  const publicSlug = biographyPublicSlugOverrides[storageSlug as BiographySlug] ?? trimmed;

  const known = biographies[storageSlug as BiographySlug];
  const existing = map.get(publicSlug);

  map.set(publicSlug, {
    slug: publicSlug,
    storageSlug,
    nameFR: entry.nameFR || known?.nameFR || existing?.nameFR || publicSlug,
    nameEN: entry.nameEN || known?.nameEN || existing?.nameEN || publicSlug,
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
    if (biographyPublicSlugOverrides[slug as BiographySlug]) continue;

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
    const isLegislative = slug === "legislative-committee";
    const isDisciplinary = slug === "disciplinary-committee" || slug === "disciplinary";
    const sitan = biographies["sitan-foune-diakite"];

    let finalNameFR = name.fr;
    let finalNameEN = name.en;
    let finalRoleFR = row.roleFR;
    let finalRoleEN = row.roleEN;

    if (isLegislative) {
      finalNameFR = sitan?.nameFR || name.fr;
      finalNameEN = sitan?.nameEN || name.en;
      finalRoleFR = roleLabels.legislativeCommittee;
      finalRoleEN = roleLabels.legislativeCommittee;
    } else if (isDisciplinary) {
      finalRoleFR = roleLabels.disciplinaryCommittee;
      finalRoleEN = roleLabels.disciplinaryCommittee;
    }

    upsertEntry(map, slug, {
      nameFR: finalNameFR,
      nameEN: finalNameEN,
      roleFR: finalRoleFR,
      roleEN: finalRoleEN,
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
    if (!slug) continue;

    const storageSlug = resolveBiographyStorageSlug(slug) ?? slug;
    const publicSlug = biographyPublicSlugOverrides[storageSlug as BiographySlug] ?? storageSlug;
    if (map.has(publicSlug)) continue;

    const known = biographies[storageSlug as BiographySlug];
    map.set(publicSlug, {
      slug: publicSlug,
      storageSlug,
      nameFR: known?.nameFR ?? publicSlug,
      nameEN: known?.nameEN ?? publicSlug,
      roleFR: "",
      roleEN: "",
    });
  }

  return [...map.values()].sort((a, b) => a.nameEN.localeCompare(b.nameEN));
}
