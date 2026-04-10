import { BookOpen, GraduationCap, History } from "lucide-react";

import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import { useI18n } from "@/lib/i18n";

export default function AcademyPage() {
  const { t } = useI18n();

  return (
    <UtilityLandingPage
      eyebrow={t.academy}
      title={t.academy}
      intro="The Academy is structured around N'ko courses, history courses, and additional programs. Some course links can stay as placeholders until the lesson materials are ready."
      cards={[
        {
          id: "nko",
          icon: BookOpen,
          title: t.coursesNko,
          description: t.coursesNkoDesc,
          ctaLabel: t.learnMore,
        },
        {
          id: "history-courses",
          icon: History,
          title: t.historyCourses,
          description: t.historyCoursesDesc,
          ctaLabel: t.learnMore,
          accent: "crimson",
        },
        {
          id: "others",
          icon: GraduationCap,
          title: t.otherCourses,
          description: t.otherCoursesDesc,
          ctaLabel: t.learnMore,
        },
      ]}
    />
  );
}
