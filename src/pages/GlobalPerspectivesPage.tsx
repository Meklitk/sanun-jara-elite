import { Building, Globe, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import type { DirectoryItem } from "@/api/types";
import { useI18n } from "@/lib/i18n";

function sortAlphabetically(items: DirectoryItem[], localize: (value: { en?: string; fr?: string } | undefined) => string) {
  return [...items].sort((a, b) => localize(a.name).localeCompare(localize(b.name)));
}

type DirectorySectionProps = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: DirectoryItem[];
  localize: (value: { en?: string; fr?: string } | undefined) => string;
  emptyMessage: string;
};

function DirectorySection({ id, icon: Icon, title, description, items, localize, emptyMessage }: DirectorySectionProps) {
  function scrollToSection() {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section id={id} className="space-y-6 scroll-mt-28">
      <button
        type="button"
        onClick={scrollToSection}
        className="flex w-full items-start gap-4 rounded-[1.7rem] border border-gold/15 bg-black/24 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] text-left transition hover:bg-black/32 hover:border-gold/25"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gold-gradient-bg">
          <Icon className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-foreground/72">{description}</p>
        </div>
      </button>

      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={`${localize(item.name)}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              className="rounded-[1.55rem] border border-gold/12 bg-white/[0.03] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.16)]"
            >
              <p className="text-[11px] uppercase tracking-[0.26em] text-gold/70">{title}</p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{localize(item.name)}</h3>
              {localize(item.description) ? (
                <p className="mt-3 text-sm leading-7 text-foreground/72">{localize(item.description)}</p>
              ) : null}
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-gold/20 bg-black/15 px-6 py-10 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

type GlobalPerspectivesPageProps = {
  section?: "country" | "organization";
};

export default function GlobalPerspectivesPage({ section }: GlobalPerspectivesPageProps) {
  const { t, localize } = useI18n();
  const { page, title, content, isLoading, error } = useCmsPage("global-perspectives");

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const paragraphs = splitParagraphs(content);
  const countries = sortAlphabetically(page.directory?.countries ?? [], localize);
  const organizations = sortAlphabetically(page.directory?.organizations ?? [], localize);

  return (
    <div className="space-y-8 sm:space-y-10 w-full">
      {(!section || section === "country") && (
        <section className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-gold/15 bg-black/35 p-4 sm:p-6 lg:p-10 shadow-[0_28px_100px_rgba(0,0,0,0.34)]">
          <div className="max-w-4xl">
            <p className="mb-3 sm:mb-4 text-xs uppercase tracking-[0.38em] text-gold/70">{t.globalPerspectives}</p>
            <h1 className="text-2xl sm:text-4xl font-bold gold-gradient-text sm:text-5xl">{title || t.globalPerspectives}</h1>
            {!section && paragraphs.length ? (
              <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-sm sm:text-base leading-7 sm:leading-8 text-foreground/76">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {(!section || section === "country") && (
        <DirectorySection
          id="country"
          icon={Globe}
          title={t.byCountry}
          description={t.byCountryDesc}
          items={countries}
          localize={localize}
          emptyMessage="No countries have been added yet. Add them from the admin dashboard and they will appear here in alphabetical order."
        />
      )}

      {(!section || section === "organization") && (
        <DirectorySection
          id="organization"
          icon={Building}
          title={t.byOrganization}
          description={t.byOrganizationDesc}
          items={organizations}
          localize={localize}
          emptyMessage="No organizations have been added yet. Add them from the admin dashboard and they will appear here in alphabetical order."
        />
      )}
    </div>
  );
}
