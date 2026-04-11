import { LogIn, UserCheck, UserPlus, Shield } from "lucide-react";

import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import { useI18n } from "@/lib/i18n";

export default function IntranetPage() {
  const { t } = useI18n();

  return (
    <UtilityLandingPage
      eyebrow={t.intranet}
      title={t.intranet}
      intro="This area is reserved for the web app entry points: login, membership onboarding, and recommendations."
      cards={[
        {
          id: "login",
          icon: LogIn,
          title: t.connection,
          description: "Sign in to the web application.",
          ctaLabel: t.connectBtn,
        },
        {
          id: "membership",
          icon: UserPlus,
          title: t.notYetMember,
          description: "Start the membership process when enrollment is ready.",
          ctaLabel: t.joinBtn,
        },
        {
          id: "recommendation",
          icon: UserCheck,
          title: t.recommendSomeone,
          description: "Submit recommendations or trusted referrals into the network.",
          ctaLabel: t.recommendBtn,
          accent: "crimson",
        },
        {
          id: "admin",
          icon: Shield,
          title: "Admin Login",
          description: "Administrator access to manage site content.",
          ctaLabel: "Login",
          href: "/admin",
          accent: "gold",
        },
      ]}
    />
  );
}
