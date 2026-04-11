import type { LucideIcon } from "lucide-react";
import { BookOpen, Briefcase, GraduationCap, HelpCircle, History, Users } from "lucide-react";

import type { UtilityCard } from "@/api/types";
import type { TranslationKey } from "@/lib/i18n";

export type UtilityCardDefinition = {
  id: string;
  icon: LucideIcon;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  accent?: "gold" | "crimson";
};

export const referenceBureauCardDefinitions: UtilityCardDefinition[] = [
  {
    id: "join",
    icon: Users,
    titleKey: "wantToJoin",
    descriptionKey: "wantToJoinDesc",
  },
  {
    id: "questions",
    icon: HelpCircle,
    titleKey: "haveQuestions",
    descriptionKey: "haveQuestionsDesc",
    accent: "crimson",
  },
  {
    id: "entrepreneur",
    icon: Briefcase,
    titleKey: "iAmEntrepreneur",
    descriptionKey: "iAmEntrepreneurDesc",
  },
];

export const academyCardDefinitions: UtilityCardDefinition[] = [
  {
    id: "nko",
    icon: BookOpen,
    titleKey: "coursesNko",
    descriptionKey: "coursesNkoDesc",
  },
  {
    id: "history-courses",
    icon: History,
    titleKey: "historyCourses",
    descriptionKey: "historyCoursesDesc",
    accent: "crimson",
  },
  {
    id: "others",
    icon: GraduationCap,
    titleKey: "otherCourses",
    descriptionKey: "otherCoursesDesc",
  },
];

export function emptyUtilityCard(id: string): UtilityCard {
  return {
    id,
    title: { en: "" },
    description: { en: "" },
    url: "",
  };
}

export function findUtilityCard(cards: UtilityCard[] | undefined, id: string) {
  return cards?.find((card) => card.id === id);
}
