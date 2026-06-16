import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import { SECTION_EMOJIS } from "@/lib/section-emojis";
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
          title: t.connection,
          description: "Sign in to the web application.",
          ctaLabel: t.connectBtn,
          emoji: SECTION_EMOJIS.login,
        },
        {
          id: "membership",
          title: t.notYetMember,
          description: "Start the membership process when enrollment is ready.",
          ctaLabel: t.joinBtn,
          emoji: SECTION_EMOJIS.membership,
        },
        {
          id: "recommendation",
          title: t.recommendSomeone,
          description: "Submit recommendations or trusted referrals into the network.",
          ctaLabel: t.recommendBtn,
          accent: "crimson",
          emoji: SECTION_EMOJIS.recommendation,
        },
        {
          id: "admin",
          title: "Admin Login",
          description: "Administrator access to manage site content.",
          ctaLabel: "Login",
          href: "/admin",
          accent: "gold",
          emoji: SECTION_EMOJIS.admin,
        },
      ]}
    />
  );
}
