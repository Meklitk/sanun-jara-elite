import { Building, Globe, Handshake, type LucideIcon } from "lucide-react";

import FederationRegionsGallery from "@/components/FederationRegionsGallery";
import MandenFederationMap from "@/components/MandenFederationMap";
import SectionHeroImage from "@/components/SectionHeroImage";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import { CARD_IMAGES } from "@/lib/card-images";
import { useI18n } from "@/lib/i18n";

type VisualSectionProps = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
};

function VisualSection({ id, icon: Icon, title, description, children }: VisualSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 space-y-6">
      <div className="flex items-start gap-4 rounded-[1.7rem] border border-gold/15 bg-black/24 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gold-gradient-bg">
          <Icon className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-foreground/72">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

type GlobalPerspectivesPageProps = {
  section?: "country" | "organization" | "affiliation";
};

export default function GlobalPerspectivesPage({ section }: GlobalPerspectivesPageProps) {
  const { t } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("global-perspectives");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const federationMapSrc =
    page.featuredImage || page.images?.[0] || "/images/maps/manden-federation-map.jpg";

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      {(!section || section === "country") && (
        <section className="overflow-hidden rounded-[1.5rem] border border-gold/15 bg-black/35 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34)] sm:rounded-[2rem] sm:p-6 lg:p-10">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs uppercase tracking-[0.38em] text-gold/70 sm:mb-4">{t.globalPerspectives}</p>
            <h1 className="text-2xl font-bold gold-gradient-text sm:text-4xl lg:text-5xl">
              {title || t.globalPerspectives}
            </h1>
            {!section && paragraphs.length ? (
              <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/76 sm:mt-5 sm:space-y-4 sm:text-base sm:leading-8">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {(!section || section === "country") && (
        <VisualSection id="country" icon={Globe} title={t.byCountry} description={t.byCountryDesc}>
          <MandenFederationMap mapSrc={federationMapSrc} />
          <FederationRegionsGallery />
        </VisualSection>
      )}

      {(!section || section === "organization") && (
        <VisualSection
          id="organization"
          icon={Building}
          title={t.byOrganization}
          description={t.byOrganizationDesc}
        >
          <SectionHeroImage src={CARD_IMAGES.organizationHero} alt={t.byOrganization} />
        </VisualSection>
      )}

      {(!section || section === "affiliation") && (
        <VisualSection
          id="affiliation"
          icon={Handshake}
          title={t.byAffiliation}
          description={t.byAffiliationDesc}
        >
          <SectionHeroImage src={CARD_IMAGES.affiliationHero} alt={t.byAffiliation} />
        </VisualSection>
      )}
    </div>
  );
}
