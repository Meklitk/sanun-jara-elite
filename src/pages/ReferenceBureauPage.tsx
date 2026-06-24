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
import { resolveReferenceBureauIntro } from "@/features/pages/reference-bureau-intro";
import { sectionEmoji } from "@/lib/section-emojis";
import { useI18n } from "@/lib/i18n";
import { MembershipForm, QuestionsForm, CotiserSection, EntrepreneurSection } from "@/components/forms/ReferenceBureauForms";

type ReferenceBureauPageProps = {
  section?: "join" | "questions" | "cotiser" | "entrepreneur";
};

export default function ReferenceBureauPage({ section }: ReferenceBureauPageProps) {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("reference-bureau");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const allCards = referenceBureauCardDefinitions
    .map((definition) => {
      const card = findUtilityCard(page.utilityCards, definition.id)
        ?? (definition.id === "entrepreneur"
          ? findUtilityCard(page.utilityCards, "cotiser")
          : undefined);
      const resolvedTitle = localize(card?.title) || t[definition.titleKey];
      const resolvedDescription = localize(card?.description) || t[definition.descriptionKey];
      const href = card?.url?.trim() || referenceBureauDefaultPaths[definition.id] || `/reference-bureau/${definition.id}`;

      if (!resolvedTitle && !resolvedDescription && !href) return null;

      return {
        id: definition.id,
        title: resolvedTitle,
        description: resolvedDescription,
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href,
        emoji: sectionEmoji(definition.id),
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
        {section === "entrepreneur" && <EntrepreneurSection />}
      </div>
    );
  }

  return (
    <UtilityLandingPage
      eyebrow={t.referenceBureau}
      title={title || t.referenceBureau}
      intro={resolveReferenceBureauIntro(content, t.referenceBureauIntro)}
      cards={allCards}
    />
  );
}
