export type IntroSection = {
  heading?: string;
  body: string;
};

export const introductionFallbackSections = {
  en: [
    { heading: "Sanun Jara", body: "Overview content will be supplied by the client." },
    { heading: "Manden", body: "Overview of the empire and territory will be supplied by the client." },
    { heading: "Vision", body: "Vision content will be supplied by the client." },
    { heading: "Mission", body: "Mission content will be supplied by the client." },
    { heading: "Fundamental Values", body: "Fundamental values content will be supplied by the client." },
    { heading: "Culture", body: "Culture content will be supplied by the client." },
  ],
  fr: [
    { heading: "Sanun Jara", body: "Le contenu de présentation sera fourni par le client." },
    { heading: "Manden", body: "Le contenu sur l'empire et le territoire sera fourni par le client." },
    { heading: "Vision", body: "Le contenu de la vision sera fourni par le client." },
    { heading: "Mission", body: "Le contenu de la mission sera fourni par le client." },
    { heading: "Valeurs fondamentales", body: "Le contenu des valeurs fondamentales sera fourni par le client." },
    { heading: "Culture", body: "Le contenu culturel sera fourni par le client." },
  ],
} as const;

export type SectionVisual = {
  iconSrc: string;
  iconAltEn: string;
  iconAltFr: string;
  taglineEn: string;
  taglineFr: string;
  accent: "gold" | "crimson" | "amber";
};

const SECTION_VISUALS: Record<string, SectionVisual> = {
  "sanun jara": {
    iconSrc: "/images/emblem-sanunjara.png",
    iconAltEn: "Golden lion emblem of Sanun Jara",
    iconAltFr: "Emblème du lion d'or de Sanun Jara",
    taglineEn: "The golden lion administration",
    taglineFr: "L'administration du lion d'or",
    accent: "gold",
  },
  menden: {
    iconSrc: "/images/icons/intro/manden-union.svg",
    iconAltEn: "Unity of the Manden federation",
    iconAltFr: "Unité de la fédération du Manden",
    taglineEn: "Union of all peoples",
    taglineFr: "L'union de tous les peuples",
    accent: "amber",
  },
  vision: {
    iconSrc: "/images/icons/intro/vision-horizon.svg",
    iconAltEn: "Sunrise over the Manden horizon",
    iconAltFr: "Lever de soleil sur l'horizon du Manden",
    taglineEn: "Where we are headed",
    taglineFr: "L'horizon que nous visons",
    accent: "gold",
  },
  mission: {
    iconSrc: "/images/icons/intro/mission-shield.svg",
    iconAltEn: "Shield of Manden governance",
    iconAltFr: "Bouclier de la gouvernance du Manden",
    taglineEn: "What we do every day",
    taglineFr: "Ce que nous accomplissons",
    accent: "crimson",
  },
  "fundamental values": {
    iconSrc: "/images/icons/intro/values-scroll.svg",
    iconAltEn: "Kouroukan Fouga constitutional scroll",
    iconAltFr: "Parchemin constitutionnel du Kouroukan Fouga",
    taglineEn: "Principles we never bend",
    taglineFr: "Les principes que nous honorons",
    accent: "gold",
  },
  "valeurs fondamentales": {
    iconSrc: "/images/icons/intro/values-scroll.svg",
    iconAltEn: "Kouroukan Fouga constitutional scroll",
    iconAltFr: "Parchemin constitutionnel du Kouroukan Fouga",
    taglineEn: "Principles we never bend",
    taglineFr: "Les principes que nous honorons",
    accent: "gold",
  },
  culture: {
    iconSrc: "/images/icons/intro/culture-kora.svg",
    iconAltEn: "Kora and griot heritage of Manden",
    iconAltFr: "Kora et patrimoine des griots du Manden",
    taglineEn: "Living heritage in motion",
    taglineFr: "Un patrimoine vivant",
    accent: "amber",
  },
};

const DEFAULT_VISUALS: SectionVisual[] = [
  {
    iconSrc: "/images/emblem-sanunjara.png",
    iconAltEn: "Golden lion emblem",
    iconAltFr: "Emblème du lion d'or",
    taglineEn: "Foundation",
    taglineFr: "Fondation",
    accent: "gold",
  },
  {
    iconSrc: "/images/icons/intro/manden-union.svg",
    iconAltEn: "Manden unity",
    iconAltFr: "Unité du Manden",
    taglineEn: "Our world",
    taglineFr: "Notre monde",
    accent: "amber",
  },
  {
    iconSrc: "/images/icons/intro/vision-horizon.svg",
    iconAltEn: "Manden horizon",
    iconAltFr: "Horizon du Manden",
    taglineEn: "Forward look",
    taglineFr: "Regard vers l'avenir",
    accent: "gold",
  },
  {
    iconSrc: "/images/icons/intro/mission-shield.svg",
    iconAltEn: "Manden mission",
    iconAltFr: "Mission du Manden",
    taglineEn: "In action",
    taglineFr: "En action",
    accent: "crimson",
  },
  {
    iconSrc: "/images/icons/intro/values-scroll.svg",
    iconAltEn: "Ancestral principles",
    iconAltFr: "Principes ancestraux",
    taglineEn: "Our compass",
    taglineFr: "Notre boussole",
    accent: "gold",
  },
  {
    iconSrc: "/images/icons/intro/culture-kora.svg",
    iconAltEn: "Living Manden culture",
    iconAltFr: "Culture vivante du Manden",
    taglineEn: "Soul of Manden",
    taglineFr: "L'âme du Manden",
    accent: "amber",
  },
];

function normalizeHeading(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function resolveSectionVisual(heading: string | undefined, index: number): SectionVisual {
  const key = normalizeHeading(heading ?? "");
  return SECTION_VISUALS[key] ?? DEFAULT_VISUALS[index % DEFAULT_VISUALS.length];
}

export function parseIntroductionSections(content: string): IntroSection[] {
  if (!content.includes("## ")) {
    return content
      .split(/\n\s*\n/g)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((body) => ({ body }));
  }

  return content
    .split(/^## /m)
    .filter(Boolean)
    .map((block) => {
      const [heading, ...rest] = block.split("\n");
      return {
        heading: heading.trim(),
        body: rest.join("\n").trim(),
      };
    })
    .filter((section) => section.heading || section.body);
}
