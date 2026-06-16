import type { DirectoryItem } from "@/api/types";

export const defaultFederationEntries: DirectoryItem[] = [
  {
    name: { en: "Niani", fr: "Niani" },
    description: {
      en: "The heart of the Manden Empire — institutions, architecture, and Niani TV.",
      fr: "Le cœur de l'Empire Manden — institutions, architecture et Niani TV.",
    },
    url: "/niani",
  },
  {
    name: { en: "Hamana", fr: "Hamana" },
    description: {
      en: "Content for Hamana will be added in a future contract.",
      fr: "Le contenu pour Hamana sera ajouté dans un contrat futur.",
    },
  },
  {
    name: { en: "Tombouctou", fr: "Tombouctou" },
    description: {
      en: "Discover Tombouctou, the city of 333 saints and a pillar of Manden heritage.",
      fr: "Découvrez Tombouctou, la ville des 333 saints et un pilier du patrimoine du Manden.",
    },
    url: "/tombouctou",
  },
];

function hasMeaningfulEntry(item: DirectoryItem) {
  return Boolean(item.name?.en?.trim() || item.name?.fr?.trim());
}

export function resolveDefaultFederationEntries(items: DirectoryItem[]) {
  const meaningful = items.filter(hasMeaningfulEntry);
  return meaningful.length > 0 ? meaningful : defaultFederationEntries;
}
