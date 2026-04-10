import { Building, Globe } from "lucide-react";

import UtilityLandingPage from "@/features/pages/UtilityLandingPage";
import { useI18n } from "@/lib/i18n";

export default function GlobalPerspectivesPage() {
  const { t } = useI18n();

  return (
    <UtilityLandingPage
      eyebrow={t.globalPerspectives}
      title={t.globalPerspectives}
      intro="Browse the Manden network through country and organizational views. We can expand these directories over time as more records are prepared."
      cards={[
        {
          id: "country",
          icon: Globe,
          title: t.byCountry,
          description: t.byCountryDesc,
          ctaLabel: t.learnMore,
        },
        {
          id: "organization",
          icon: Building,
          title: t.byOrganization,
          description: t.byOrganizationDesc,
          ctaLabel: t.learnMore,
        },
      ]}
    />
  );
}
