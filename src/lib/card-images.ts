export type CardImageKey =
  | "affiliationHero"
  | "organizationHero"
  | "federationHero"
  | "referenceBureauJoin"
  | "referenceBureauQuestions"
  | "referenceBureauEntrepreneur"
  | "referenceBureauCotiser"
  | "nianiInstitutions"
  | "nianiArchitecture"
  | "nianiTv"
  | "nianiCartoons"
  | "nianiWomen"
  | "academyNko"
  | "academyHistory"
  | "academyOthers"
  | "commerceMarket"
  | "economyHero";

export type CardImageSlot = {
  filename: string;
  section: "global-perspectives" | "reference-bureau" | "academy" | "niani" | "commerce" | "economy";
  labelEn: string;
  labelFr: string;
  hintEn: string;
  hintFr: string;
};

export const CARD_IMAGE_SLOTS: Record<CardImageKey, CardImageSlot> = {
  affiliationHero: {
    filename: "affiliation-bowing.svg",
    section: "global-perspectives",
    labelEn: "Affiliation — bowing figure",
    labelFr: "Affiliation — personne inclinée",
    hintEn: "Person bowing to the king: one knee down, one fist on chest.",
    hintFr: "Personne s'inclinant : un genou au sol, un poing sur la poitrine.",
  },
  organizationHero: {
    filename: "organization-mansa-musa.svg",
    section: "global-perspectives",
    labelEn: "Organization — Mansa Musa",
    labelFr: "Organisation — Mansa Musa",
    hintEn: "Inspired by the famous Catalan Atlas image.",
    hintFr: "Inspiré de l'image célèbre de l'Atlas catalan.",
  },
  federationHero: {
    filename: "federation-hero.svg",
    section: "global-perspectives",
    labelEn: "Federation",
    labelFr: "Fédération",
    hintEn: "Cartoon illustration for the Federation section.",
    hintFr: "Illustration cartoon pour la section Fédération.",
  },
  referenceBureauJoin: {
    filename: "join-dozo-hunter.svg",
    section: "reference-bureau",
    labelEn: "I want to join",
    labelFr: "Je veux rejoindre",
    hintEn: "Dozo hunter clothes: one hand on chest, other holding traditional gun.",
    hintFr: "Tenue de chasseur Donso : une main sur la poitrine, l'autre avec le fusil.",
  },
  referenceBureauQuestions: {
    filename: "questions.svg",
    section: "reference-bureau",
    labelEn: "I have questions",
    labelFr: "J'ai des questions",
    hintEn: "Thinking person or question mark illustration.",
    hintFr: "Personne qui réfléchit ou point d'interrogation.",
  },
  referenceBureauEntrepreneur: {
    filename: "entrepreneur.svg",
    section: "reference-bureau",
    labelEn: "I am an entrepreneur",
    labelFr: "Je suis entrepreneur",
    hintEn: "Cartoon illustration for the entrepreneur section.",
    hintFr: "Illustration cartoon pour la section entrepreneur.",
  },
  referenceBureauCotiser: {
    filename: "cotiser.svg",
    section: "reference-bureau",
    labelEn: "Cotiser",
    labelFr: "Cotiser",
    hintEn: "Donation / contribution illustration for the Cotiser page.",
    hintFr: "Illustration pour la page Cotiser (contributions).",
  },
  nianiInstitutions: {
    filename: "niani-institutions.svg",
    section: "niani",
    labelEn: "Institutions",
    labelFr: "Institutions",
    hintEn: "Hand unrolling scroll with Manden map (Manden Kala).",
    hintFr: "Main déroulant le parchemin avec la carte du Manden.",
  },
  nianiArchitecture: {
    filename: "niani-architecture.svg",
    section: "niani",
    labelEn: "Architectural projects",
    labelFr: "Projets architecturaux",
    hintEn: "3D dome / hall architectural concept.",
    hintFr: "Concept architectural du dôme / hall.",
  },
  nianiTv: {
    filename: "niani-tv.jpg",
    section: "niani",
    labelEn: "Niani TV",
    labelFr: "Niani TV",
    hintEn: "Village scene with camera / cinematographer.",
    hintFr: "Village avec caméra / cinéaste.",
  },
  nianiCartoons: {
    filename: "niani-cartoons.svg",
    section: "niani",
    labelEn: "Niani TV — Cartoons",
    labelFr: "Niani TV — Dessins animés",
    hintEn: "Hero image for the cartoon / animation section.",
    hintFr: "Image d'en-tête pour la section dessins animés.",
  },
  nianiWomen: {
    filename: "niani-women.svg",
    section: "niani",
    labelEn: "Women's institution",
    labelFr: "Institution des femmes",
    hintEn: "Default image for the Women's institution card.",
    hintFr: "Image par défaut pour l'institution des femmes.",
  },
  academyNko: {
    filename: "academy-nko.jpg",
    section: "academy",
    labelEn: "N'ko courses",
    labelFr: "Cours N'ko",
    hintEn: "People learning under a tree (N'ko lessons).",
    hintFr: "Apprentissage sous l'arbre (cours N'ko).",
  },
  academyHistory: {
    filename: "academy-history.svg",
    section: "academy",
    labelEn: "History courses",
    labelFr: "Cours d'histoire",
    hintEn: "Manden Empire history learning scene.",
    hintFr: "Scène d'apprentissage de l'histoire du Manden.",
  },
  academyOthers: {
    filename: "academy-others.svg",
    section: "academy",
    labelEn: "Other courses",
    labelFr: "Autres cours",
    hintEn: "General academy / courses illustration.",
    hintFr: "Illustration générale des cours.",
  },
  commerceMarket: {
    filename: "commerce-market.svg",
    section: "commerce",
    labelEn: "Commerce market",
    labelFr: "Marché du commerce",
    hintEn: "Cartoon market: woman shopping for grain with a bag.",
    hintFr: "Marché cartoon : femme achetant du grain avec un sac.",
  },
  economyHero: {
    filename: "economy-hero.svg",
    section: "economy",
    labelEn: "Economy illustration",
    labelFr: "Illustration économie",
    hintEn: "Main hero image for the Economy page.",
    hintFr: "Image principale de la page Économie.",
  },
};

export const CARD_IMAGES = Object.fromEntries(
  Object.entries(CARD_IMAGE_SLOTS).map(([key, slot]) => [
    key,
    `/images/cards/${slot.filename}`,
  ])
) as Record<CardImageKey, string>;

export const CARD_IMAGE_KEYS = Object.keys(CARD_IMAGE_SLOTS) as CardImageKey[];

export function cardImageKeysForSection(
  section: CardImageSlot["section"]
): CardImageKey[] {
  return CARD_IMAGE_KEYS.filter((key) => CARD_IMAGE_SLOTS[key].section === section);
}

export const SECTION_CARD_IMAGE_KEYS: Record<string, CardImageKey> = {
  nko: "academyNko",
  "niani-tv": "nianiTv",
};

export function sectionCardImage(key: string): string | undefined {
  const imageKey = SECTION_CARD_IMAGE_KEYS[key];
  return imageKey ? CARD_IMAGES[imageKey] : undefined;
}
