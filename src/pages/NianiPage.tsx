import { Building2, Tv, Landmark } from "lucide-react";
import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import { useI18n } from "@/lib/i18n";

type NianiPageProps = {
  section?: "institutions" | "architectural-projects" | "niani-tv";
};

const nianiCardDefinitions = [
  {
    id: "institutions",
    icon: Landmark,
    titleKey: "institutions" as const,
    descriptionKey: "institutionsDesc" as const,
    accent: "gold" as const,
    path: "/niani/institutions",
  },
  {
    id: "architectural-projects",
    icon: Building2,
    titleKey: "architecturalProjects" as const,
    descriptionKey: "architecturalProjectsDesc" as const,
    accent: "gold" as const,
    path: "/niani/architectural-projects",
  },
  {
    id: "niani-tv",
    icon: Tv,
    titleKey: "nianiTv" as const,
    descriptionKey: "nianiTvDesc" as const,
    accent: "crimson" as const,
    path: "/niani/niani-tv",
  },
];

export default function NianiPage({ section }: NianiPageProps) {
  const { t } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("niani");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;

  const cards = nianiCardDefinitions
    .map((definition) => {
      return {
        id: definition.id,
        icon: definition.icon,
        title: t[definition.titleKey],
        description: t[definition.descriptionKey],
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href: definition.path,
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const filteredCards = section
    ? cards.filter((card) => card.id === section)
    : cards;

  return (
    <UtilityLandingPage
      eyebrow={t.niani}
      title={title || t.niani}
      intro={
        !section
          ? content || "Niani - The heart of the Manden Empire. Explore institutions, architectural projects, and our media channel."
          : ""
      }
      cards={filteredCards}
    />
  );
}
