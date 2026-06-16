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
  emoji: string;
  taglineEn: string;
  taglineFr: string;
  accent: "gold" | "crimson" | "amber";
};

const SECTION_VISUALS: Record<string, SectionVisual> = {
  "sanun jara": {
    emoji: "🦁",
    taglineEn: "The golden lion administration",
    taglineFr: "L'administration du lion d'or",
    accent: "gold",
  },
  menden: {
    emoji: "🌍",
    taglineEn: "Union of all peoples",
    taglineFr: "L'union de tous les peuples",
    accent: "amber",
  },
  vision: {
    emoji: "✨",
    taglineEn: "Where we are headed",
    taglineFr: "L'horizon que nous visons",
    accent: "gold",
  },
  mission: {
    emoji: "🎯",
    taglineEn: "What we do every day",
    taglineFr: "Ce que nous accomplissons",
    accent: "crimson",
  },
  "fundamental values": {
    emoji: "📖",
    taglineEn: "Principles we never bend",
    taglineFr: "Les principes que nous honorons",
    accent: "gold",
  },
  "valeurs fondamentales": {
    emoji: "📖",
    taglineEn: "Principles we never bend",
    taglineFr: "Les principes que nous honorons",
    accent: "gold",
  },
  culture: {
    emoji: "🎭",
    taglineEn: "Living heritage in motion",
    taglineFr: "Un patrimoine vivant",
    accent: "amber",
  },
};

const DEFAULT_VISUALS: SectionVisual[] = [
  { emoji: "🦁", taglineEn: "Foundation", taglineFr: "Fondation", accent: "gold" },
  { emoji: "🌍", taglineEn: "Our world", taglineFr: "Notre monde", accent: "amber" },
  { emoji: "✨", taglineEn: "Forward look", taglineFr: "Regard vers l'avenir", accent: "gold" },
  { emoji: "🎯", taglineEn: "In action", taglineFr: "En action", accent: "crimson" },
  { emoji: "📖", taglineEn: "Our compass", taglineFr: "Notre boussole", accent: "gold" },
  { emoji: "🎭", taglineEn: "Soul of Manden", taglineFr: "L'âme du Manden", accent: "amber" },
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
