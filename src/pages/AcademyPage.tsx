import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import { academyCardDefinitions, findUtilityCard } from "@/features/pages/utility-page-config";
import { useI18n } from "@/lib/i18n";

type AcademyPageProps = {
  section?: "nko" | "history-courses" | "others";
};

export default function AcademyPage({ section }: AcademyPageProps) {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("academy");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const allCards = academyCardDefinitions
    .map((definition) => {
      const card = findUtilityCard(page.utilityCards, definition.id);
      const resolvedTitle = localize(card?.title) || t[definition.titleKey];
      const resolvedDescription = localize(card?.description) || t[definition.descriptionKey];
      const href = card?.url?.trim() || "";

      if (!resolvedTitle && !resolvedDescription && !href) return null;

      return {
        id: definition.id,
        icon: definition.icon,
        title: resolvedTitle,
        description: resolvedDescription,
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href,
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const filteredCards = section
    ? allCards.filter((card) => card.id === section)
    : allCards;

  return (
    <UtilityLandingPage
      eyebrow={t.academy}
      title={title || t.academy}
      intro={
        !section
          ? content || "The Academy is structured around N'ko courses, history courses, and additional programs."
          : ""
      }
      cards={filteredCards}
    />
  );
}
