export type BiographyEntry = {
  nameFR: string;
  nameEN: string;
  fr: string;
  en: string;
};

export const biographies = {
  "mansa-mari-diata-v-keita": {
    nameFR: "Mansa Mari Diata V Keita",
    nameEN: "Mansa Mari Diata V Keita",
    fr: "/biographies/mansa-mari-diata-v-keita-fr.pdf",
    en: "/biographies/mansa-mari-diata-v-keita-en.pdf",
  },
  "sitan-foune-diakite": {
    nameFR: "Son Excellence Sitan Founé Diakité",
    nameEN: "Her Excellency Sitan Founé Diakité",
    fr: "/biographies/sitan-foune-diakite-fr.pdf",
    en: "/biographies/sitan-foune-diakite-en.pdf",
  },
  "mabougnata-djeliba-ibrahim-diabate": {
    nameFR: "Mabougnata Djeliba Ibrahim Diabate",
    nameEN: "Mabougnata Djeliba Ibrahim Diabate",
    fr: "",
    en: "",
  },
  "wana-papa-sylla": {
    nameFR: "Wana Papa Sylla",
    nameEN: "Wana Papa Sylla",
    fr: "",
    en: "",
  },
} satisfies Record<string, BiographyEntry>;

export type BiographySlug = keyof typeof biographies;

export const biographySlugAliases: Record<string, BiographySlug> = {
  "mari-djata-keita-v": "mansa-mari-diata-v-keita",
  "mabougnata-dibla-ibrahim-diabate": "mabougnata-djeliba-ibrahim-diabate",
  "mabougnata-alpha-omar-kaba": "wana-papa-sylla",
};

export const biographySlugByGovernanceKey = {
  mandenMansa: "mansa-mari-diata-v-keita",
  mandenDjeliba: "mabougnata-djeliba-ibrahim-diabate",
  mandenMory: "wana-papa-sylla",
} as const satisfies Record<string, BiographySlug>;

const normalizedNameToSlug: Record<string, BiographySlug> = {
  "mansa mari diata v keita": "mansa-mari-diata-v-keita",
  "mari djata keita v": "mansa-mari-diata-v-keita",
  "sitan foune diakite": "sitan-foune-diakite",
  "son excellence sitan foune diakite": "sitan-foune-diakite",
  "her excellency sitan foune diakite": "sitan-foune-diakite",
  "mabougnata djeliba ibrahim diabate": "mabougnata-djeliba-ibrahim-diabate",
  "mabougnata dibla ibrahim diabate": "mabougnata-djeliba-ibrahim-diabate",
  "wana papa sylla": "wana-papa-sylla",
  "manden mory papa sylla": "wana-papa-sylla",
  "mabougnata alpha omar kaba": "wana-papa-sylla",
};

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function isBiographySlug(slug: string): slug is BiographySlug {
  return slug in biographies;
}

export function resolveBiographySlug(slug: string): BiographySlug | null {
  if (isBiographySlug(slug)) return slug;
  const alias = biographySlugAliases[slug];
  return alias && isBiographySlug(alias) ? alias : null;
}

export function getBiographyDocumentUrl(slug: string) {
  const resolved = resolveBiographySlug(slug) ?? slug;
  return `/gouvernement/${resolved}`;
}

export function resolveBiographySlugFromName(name: string): BiographySlug | null {
  const normalized = normalizeName(name);
  return normalizedNameToSlug[normalized] ?? null;
}

export function resolveBiographySlugFromGovernanceKey(key: string): BiographySlug | null {
  const slug = biographySlugByGovernanceKey[key as keyof typeof biographySlugByGovernanceKey];
  return slug && isBiographySlug(slug) ? slug : null;
}

export function getBiographyEntry(slug: string): BiographyEntry | null {
  const resolved = resolveBiographySlug(slug);
  return resolved ? biographies[resolved] : null;
}
