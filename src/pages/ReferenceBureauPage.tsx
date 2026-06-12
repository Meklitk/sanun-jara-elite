import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import {
  findUtilityCard,
  referenceBureauCardDefinitions,
  referenceBureauDefaultPaths,
} from "@/features/pages/utility-page-config";
import { CARD_IMAGES } from "@/lib/card-images";
import { useI18n } from "@/lib/i18n";
import { MembershipForm, QuestionsForm, CotiserSection } from "@/components/forms/ReferenceBureauForms";

type ReferenceBureauPageProps = {
  section?: "join" | "questions" | "cotiser";
};

export default function ReferenceBureauPage({ section }: ReferenceBureauPageProps) {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("reference-bureau");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const cardImages: Record<string, string> = {
    join: CARD_IMAGES.referenceBureauJoin,
    questions: CARD_IMAGES.referenceBureauQuestions,
    cotiser: CARD_IMAGES.referenceBureauCotiser,
  };

  const allCards = referenceBureauCardDefinitions
    .map((definition) => {
      const card = findUtilityCard(page.utilityCards, definition.id);
      const resolvedTitle = localize(card?.title) || t[definition.titleKey];
      const resolvedDescription = localize(card?.description) || t[definition.descriptionKey];
      const href = card?.url?.trim() || referenceBureauDefaultPaths[definition.id] || `/reference-bureau/${definition.id}`;

      if (!resolvedTitle && !resolvedDescription && !href) return null;

      return {
        id: definition.id,
        icon: definition.icon,
        title: resolvedTitle,
        description: resolvedDescription,
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href,
        imageUrl: cardImages[definition.id],
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  if (section) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/reference-bureau"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gold/15 bg-black/20 px-4 text-xs font-semibold uppercase tracking-wider text-gold transition hover:border-gold/30 hover:bg-gold/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.referenceBureau}</span>
          </Link>
        </div>

        {section === "join" && <MembershipForm />}
        {section === "questions" && <QuestionsForm />}
        {section === "cotiser" && <CotiserSection />}
      </div>
    );
  }

  return (
    <UtilityLandingPage
      eyebrow={t.referenceBureau}
      title={title || t.referenceBureau}
      intro={
        content || "The Reference Bureau helps visitors join the network, ask questions, or register entrepreneurial interest."
      }
      cards={allCards}
    />
  );
}
