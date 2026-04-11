import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import { findUtilityCard, referenceBureauCardDefinitions } from "@/features/pages/utility-page-config";
import { useI18n } from "@/lib/i18n";

type ReferenceBureauPageProps = {
  section?: "join" | "questions" | "entrepreneur";
};

export default function ReferenceBureauPage({ section }: ReferenceBureauPageProps) {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("reference-bureau");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const allCards = referenceBureauCardDefinitions
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
      eyebrow={t.referenceBureau}
      title={title || t.referenceBureau}
      intro={
        !section
          ? content || "The Reference Bureau helps visitors join the network, ask questions, or register entrepreneurial interest."
          : ""
      }
      cards={filteredCards}
    />
  );
}
