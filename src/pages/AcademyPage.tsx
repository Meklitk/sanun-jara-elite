import NkoAlphabetLesson from "@/components/academy/NkoAlphabetLesson";
import SectionEmojiHeader from "@/components/SectionEmojiHeader";
import SectionEmptyState from "@/components/SectionEmptyState";
import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import { academyCardDefinitions, findUtilityCard } from "@/features/pages/utility-page-config";
import { useCardImages } from "@/lib/card-images-context";
import { SECTION_EMOJIS, sectionEmoji } from "@/lib/section-emojis";
import { useI18n } from "@/lib/i18n";

type AcademyPageProps = {
  section?: "nko" | "history-courses" | "others";
};

const academyDefaultPaths: Record<string, string> = {
  nko: "/academy/cours-nko",
  "history-courses": "/academy/history-courses",
  others: "/academy/others",
};

export default function AcademyPage({ section }: AcademyPageProps) {
  const { t, lang, localize } = useI18n();
  const { resolveSection } = useCardImages();
  const { page, title, content, isLoading, error } = useCmsPage("academy");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  if (section === "nko") {
    return <NkoAlphabetLesson />;
  }

  if (section === "history-courses") {
    return (
      <div className="space-y-8">
        <SectionEmojiHeader
          emoji={SECTION_EMOJIS["history-courses"]}
          eyebrow={t.academy}
          title={t.historyCourses}
          description={t.historyCoursesDesc}
        />
        <SectionEmptyState
          message={
            lang === "fr"
              ? "Les cours d'histoire du Manden seront affichés ici une fois ajoutés depuis le tableau de bord administrateur."
              : "Manden history courses will appear here once added from the admin dashboard."
          }
        />
      </div>
    );
  }

  if (section === "others") {
    return (
      <div className="space-y-8">
        <SectionEmojiHeader
          emoji={SECTION_EMOJIS.others}
          eyebrow={t.academy}
          title={t.otherCourses}
          description={t.otherCoursesDesc}
        />
        <SectionEmptyState
          message={
            lang === "fr"
              ? "Les autres cours seront affichés ici une fois ajoutés depuis le tableau de bord administrateur."
              : "Additional courses will appear here once added from the admin dashboard."
          }
        />
      </div>
    );
  }

  const allCards = academyCardDefinitions
    .map((definition) => {
      const card = findUtilityCard(page.utilityCards, definition.id);
      const resolvedTitle = localize(card?.title) || t[definition.titleKey];
      const resolvedDescription = localize(card?.description) || t[definition.descriptionKey];
      const href = card?.url?.trim() || academyDefaultPaths[definition.id] || "";

      if (!resolvedTitle && !resolvedDescription && !href) return null;

      return {
        id: definition.id,
        title: resolvedTitle,
        description: resolvedDescription,
        ctaLabel: t.learnMore,
        accent: definition.accent,
        href,
        imageUrl: resolveSection(definition.id),
        imageAlt: resolvedTitle,
        emoji: sectionEmoji(definition.id),
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  return (
    <UtilityLandingPage
      eyebrow={t.academy}
      title={title || t.academy}
      intro={
        content || "The Academy is structured around N'ko courses, history courses, and additional programs."
      }
      cards={allCards}
    />
  );
}
