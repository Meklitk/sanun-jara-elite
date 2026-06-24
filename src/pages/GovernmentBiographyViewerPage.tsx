import { useEffect, useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getBiographyEntry, resolveBiographySlug } from "@/data/biographies";
import { listBiographyProfiles, type BiographyProfile } from "@/api/biographies";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  splitParagraphs,
  useCmsPage,
} from "@/features/pages/page-content";
import { resolveGovernanceLeaderBySlug } from "@/features/governance/resolve-governance-leader";
import { useI18n } from "@/lib/i18n";
import {
  fetchBiographyDocuments,
  isBiographyImageUrl,
  isBiographyPdfUrl,
} from "@/lib/biography-document";

import InlinePdfViewer from "@/components/InlinePdfViewer";

type DocumentLanguage = "fr" | "en";

export default function GovernmentBiographyViewerPage() {
  const { slug = "" } = useParams();
  const { lang, t } = useI18n();
  const { page, isLoading, error } = useCmsPage("governance");
  const [documentLanguage, setDocumentLanguage] = useState<DocumentLanguage>("fr");
  const [resolvedDocuments, setResolvedDocuments] = useState<Record<DocumentLanguage, string | null>>({
    fr: null,
    en: null,
  });
  const [documentAvailability, setDocumentAvailability] = useState<Record<DocumentLanguage, boolean | null>>({
    fr: null,
    en: null,
  });
  const [profile, setProfile] = useState<BiographyProfile | null>(null);

  const canonicalSlug = resolveBiographySlug(slug) ?? slug;
  const documentEntry = getBiographyEntry(slug);
  const documentUrl = resolvedDocuments[documentLanguage];

  useEffect(() => {
    if (!documentEntry) return;

    let cancelled = false;

    (async () => {
      const documents = await fetchBiographyDocuments(canonicalSlug);

      if (cancelled) return;

      setResolvedDocuments(documents);
      setDocumentAvailability({
        fr: Boolean(documents.fr),
        en: Boolean(documents.en),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [canonicalSlug, documentEntry]);

  useEffect(() => {
    if (documentAvailability[documentLanguage] !== false) return;

    if (documentAvailability.fr) {
      setDocumentLanguage("fr");
      return;
    }

    if (documentAvailability.en) {
      setDocumentLanguage("en");
    }
  }, [documentAvailability, documentLanguage]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await listBiographyProfiles();
        if (cancelled) return;
        setProfile(res.profiles?.[canonicalSlug] ?? res.profiles?.[slug] ?? null);
      } catch {
        if (!cancelled) setProfile(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canonicalSlug, slug]);

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  const leader = resolveGovernanceLeaderBySlug(slug, page, (value) => {
    if (!value) return "";
    return lang === "fr" ? value.fr ?? value.en ?? "" : value.en ?? value.fr ?? "";
  }, t);

  if (!leader) return <PageNotFoundState />;

  const displayName =
    documentEntry && (lang === "fr" ? documentEntry.nameFR : documentEntry.nameEN)
      ? lang === "fr"
        ? documentEntry.nameFR
        : documentEntry.nameEN
      : leader.name;

  const placeholderBio =
    lang === "fr"
      ? "Biographie à venir. Le contenu détaillé sera fourni prochainement par l'administration."
      : "Biography coming soon. Detailed content will be provided by the administration shortly.";

  const summaryText =
    lang === "fr" ? profile?.summary?.fr?.trim() : profile?.summary?.en?.trim();
  const summaryFallback =
    lang === "fr" ? profile?.summary?.en?.trim() : profile?.summary?.fr?.trim();
  const summaryParagraphs = splitParagraphs(summaryText || summaryFallback || "");

  const hasConfiguredDocument = Boolean(documentEntry);
  const isDocumentAvailable = documentAvailability[documentLanguage] === true;
  const isCheckingDocument =
    hasConfiguredDocument &&
    (documentAvailability.fr === null || documentAvailability.en === null);
  const showDocumentViewer = hasConfiguredDocument && (isCheckingDocument || isDocumentAvailable);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-[1.25rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.94),rgba(39,25,8,0.9))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:rounded-[2rem] sm:p-6 lg:p-8">
        <Link
          to="/gouvernement"
          className="inline-flex items-center gap-2 text-sm text-gold/82 transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Retour</span>
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-[1.5rem] border border-gold/20 bg-gold/10 text-gold md:mx-0 md:h-56 md:w-full">
            {profile?.portrait ? (
              <img
                src={profile.portrait}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-20 w-20 opacity-70" strokeWidth={1.25} />
            )}
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gold/82">
                {leader.kind === "person" ? t.person : t.institution}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-foreground/76">
                {leader.role}
              </span>
            </div>

            <h1 className="text-3xl font-bold gold-gradient-text sm:text-4xl lg:text-5xl">{displayName}</h1>
            <p className="text-sm uppercase tracking-[0.2em] text-gold/72">{leader.role}</p>
          </div>
        </div>
      </section>

      {(summaryParagraphs.length > 0 || (!showDocumentViewer && !isCheckingDocument)) && (
      <section className="rounded-[1.25rem] border border-gold/15 bg-black/25 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:rounded-[1.75rem] sm:p-6 lg:p-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{t.profileNotes}</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
          {lang === "fr" ? "Biographie" : "Biography"}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-8 text-foreground/76">
          {summaryParagraphs.length > 0 ? (
            <>
              {summaryParagraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))}
              {isDocumentAvailable ? (
                <p className="text-sm text-foreground/58">
                  {lang === "fr"
                    ? "Le document officiel complet est disponible ci-dessous."
                    : "The full official document is available below."}
                </p>
              ) : null}
            </>
          ) : (
            <p>{placeholderBio}</p>
          )}
        </div>
      </section>
      )}

      {showDocumentViewer ? (
        <section className="space-y-4">
          {isDocumentAvailable ? (
            <>
              <div className="flex flex-col gap-3 rounded-[1.25rem] border border-gold/15 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.5rem] sm:p-5">
                <p className="text-sm font-semibold text-foreground">
                  {lang === "fr" ? "Document officiel" : "Official document"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDocumentLanguage("fr")}
                    disabled={!documentAvailability.fr}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-45 ${
                      documentLanguage === "fr"
                        ? "border-gold/50 bg-gold/15 text-gold"
                        : "border-white/10 bg-white/[0.03] text-foreground/72 hover:border-gold/25 hover:text-gold"
                    }`}
                  >
                    Français
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentLanguage("en")}
                    disabled={!documentAvailability.en}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-45 ${
                      documentLanguage === "en"
                        ? "border-gold/50 bg-gold/15 text-gold"
                        : "border-white/10 bg-white/[0.03] text-foreground/72 hover:border-gold/25 hover:text-gold"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {documentUrl && isBiographyPdfUrl(documentUrl) ? (
                <InlinePdfViewer
                  key={`${slug}-${documentLanguage}`}
                  src={documentUrl}
                  title={displayName}
                  lang={lang}
                />
              ) : documentUrl && isBiographyImageUrl(documentUrl) ? (
                <div className="overflow-hidden rounded-[1.25rem] border border-gold/15 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:rounded-[1.5rem]">
                  <img
                    key={`${slug}-${documentLanguage}`}
                    src={documentUrl}
                    alt={displayName}
                    className="mx-auto w-full object-contain"
                  />
                </div>
              ) : documentUrl ? (
                <div className="overflow-hidden rounded-[1.25rem] border border-gold/15 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:rounded-[1.5rem]">
                  <object
                    key={`${slug}-${documentLanguage}`}
                    data={documentUrl}
                    type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="h-[70vh] min-h-[420px] w-full"
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-sm text-foreground/76">
                      <p>
                        {lang === "fr"
                          ? "Ce document ne peut pas être affiché directement dans le navigateur."
                          : "This document cannot be displayed directly in the browser."}
                      </p>
                      <a href={documentUrl} className="text-gold transition hover:text-gold/80">
                        {lang === "fr" ? "Ouvrir le document" : "Open document"}
                      </a>
                    </div>
                  </object>
                </div>
              ) : null}
            </>
          ) : isCheckingDocument ? (
            <div className="rounded-[1.25rem] border border-gold/15 bg-black/25 p-6 text-sm text-foreground/72 sm:rounded-[1.5rem]">
              {lang === "fr" ? "Chargement du document..." : "Loading document..."}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
