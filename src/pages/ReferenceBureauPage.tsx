import { Briefcase, HelpCircle, Users } from "lucide-react";

import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import { useI18n } from "@/lib/i18n";

export default function ReferenceBureauPage() {
  const { t } = useI18n();

  return (
    <UtilityLandingPage
      eyebrow={t.referenceBureau}
      title={t.referenceBureau}
      intro="The Reference Bureau helps visitors join the network, ask questions, or register entrepreneurial interest. These channels can start as placeholders and become fully operational over time."
      cards={[
        {
          id: "join",
          icon: Users,
          title: t.wantToJoin,
          description: t.wantToJoinDesc,
          ctaLabel: t.learnMore,
        },
        {
          id: "questions",
          icon: HelpCircle,
          title: t.haveQuestions,
          description: t.haveQuestionsDesc,
          ctaLabel: t.learnMore,
          accent: "crimson",
        },
        {
          id: "entrepreneur",
          icon: Briefcase,
          title: t.iAmEntrepreneur,
          description: t.iAmEntrepreneurDesc,
          ctaLabel: t.learnMore,
        },
      ]}
    />
  );
}
