import { useEffect, useMemo, useState } from "react";

import { CheckCircle2, ExternalLink, FileText, ImagePlus, Upload, AlertCircle } from "lucide-react";



import { biographies } from "@/data/biographies";

import {

  listBiographyFiles,

  listBiographyProfiles,

  saveBiographyProfile,

  uploadBiographyPdf,

  uploadBiographyPortrait,

  type BiographyProfilesMap,

} from "@/api/biographies";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import { formatAdmin, useAdminT } from "@/features/admin/admin-i18n";



type Props = {

  token: string;

};



type Lang = "fr" | "en";



type SummaryDraft = Record<string, { fr: string; en: string }>;



function expectedFilename(slug: string, lang: Lang) {

  return `${slug}-${lang}.pdf`;

}



function emptySummary(): { fr: string; en: string } {

  return { fr: "", en: "" };

}



export default function AdminBiographyFilesPanel({ token }: Props) {

  const at = useAdminT();

  const entries = Object.entries(biographies);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [profiles, setProfiles] = useState<BiographyProfilesMap>({});

  const [summaryDrafts, setSummaryDrafts] = useState<SummaryDraft>({});

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const [savingSlug, setSavingSlug] = useState<string | null>(null);



  const uploadedSet = useMemo(() => new Set(uploadedFiles), [uploadedFiles]);



  async function refreshFiles() {

    try {

      const res = await listBiographyFiles(token);

      setUploadedFiles(res.files);

    } catch {

      setUploadedFiles([]);

    }

  }



  async function refreshProfiles() {

    try {

      const res = await listBiographyProfiles();

      setProfiles(res.profiles ?? {});

      setSummaryDrafts((current) => {

        const next = { ...current };

        for (const [slug] of entries) {

          const summary = res.profiles?.[slug]?.summary;

          next[slug] = {

            fr: summary?.fr ?? current[slug]?.fr ?? "",

            en: summary?.en ?? current[slug]?.en ?? "",

          };

        }

        return next;

      });

    } catch {

      setProfiles({});

    }

  }



  useEffect(() => {

    void refreshFiles();

    void refreshProfiles();

  }, [token]);



  async function onSaveSummary(slug: string, options?: { silent?: boolean }) {
    const draft = summaryDrafts[slug] ?? emptySummary();
    setSavingSlug(slug);
    try {
      const res = await saveBiographyProfile(slug, draft, token);
      setProfiles((current) => ({
        ...current,
        [slug]: res.profile,
      }));
      if (!options?.silent) {
        toast.success(at.bioSummarySaved);
      }
      return true;
    } catch {
      toast.error(at.bioSummaryFailed);
      return false;
    } finally {
      setSavingSlug(null);
    }
  }

  function isSummaryDirty(slug: string) {
    const draft = summaryDrafts[slug] ?? emptySummary();
    const saved = profiles[slug]?.summary;
    return draft.fr !== (saved?.fr ?? "") || draft.en !== (saved?.en ?? "");
  }

  async function ensureSummarySaved(slug: string) {
    if (!isSummaryDirty(slug)) return true;
    const draft = summaryDrafts[slug] ?? emptySummary();
    if (!draft.fr.trim() && !draft.en.trim()) return true;
    return onSaveSummary(slug, { silent: true });
  }

  async function onUploadPdf(slug: string, lang: Lang, file: File | undefined) {
    if (!file) return;

    const key = `${slug}-${lang}`;
    setUploadingKey(key);
    try {
      await ensureSummarySaved(slug);
      const res = await uploadBiographyPdf(file, slug, lang, token);

      toast.success(

        formatAdmin(lang === "fr" ? at.bioUploadFrSuccess : at.bioUploadEnSuccess, {

          filename: res.filename,

        })

      );

      await refreshFiles();

    } catch {

      toast.error(at.bioUploadFailed);

    } finally {

      setUploadingKey(null);

    }

  }



  async function onUploadPortrait(slug: string, file: File | undefined) {
    if (!file) return;

    setUploadingKey(`${slug}-portrait`);
    try {
      await ensureSummarySaved(slug);
      const res = await uploadBiographyPortrait(file, slug, token);

      setProfiles((current) => ({

        ...current,

        [slug]: {

          ...(current[slug] ?? {}),

          portrait: res.portrait,

        },

      }));

      toast.success(at.bioPortraitSuccess);

    } catch {

      toast.error(at.bioPortraitFailed);

    } finally {

      setUploadingKey(null);

    }

  }



  return (

    <section className="space-y-4 rounded-xl border border-gold/20 bg-black/20 p-5">

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">

          <FileText className="h-4 w-4" />

        </div>

        <div>

          <h3 className="text-base font-semibold text-foreground">{at.bioDocsTitle}</h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">{at.bioDocsDesc}</p>

        </div>

      </div>



      <div className="space-y-4">

        {entries.map(([slug, entry]) => {

          const profile = profiles[slug];

          const summary = summaryDrafts[slug] ?? emptySummary();

          const portraitBusy = uploadingKey === `${slug}-portrait`;

          const summaryBusy = savingSlug === slug;



          return (

            <div key={slug} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">

              <div className="flex flex-wrap items-start justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-foreground">{entry.nameFR}</p>

                  <p className="mt-1 text-xs text-muted-foreground">

                    {at.publicPage} :{" "}

                    <a

                      href={`/gouvernement/${slug}`}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="text-gold hover:underline"

                    >

                      /gouvernement/{slug}

                    </a>

                  </p>

                </div>

                <Button variant="outline" size="sm" className="border-gold/25 text-xs" asChild>

                  <a href={`/gouvernement/${slug}`} target="_blank" rel="noopener noreferrer">

                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />

                    {at.publicPreview}

                  </a>

                </Button>

              </div>



              <div className="mt-5 grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">

                <div className="space-y-3">

                  <Label className="text-xs uppercase tracking-[0.16em] text-gold/80">{at.bioPortrait}</Label>

                  <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-gold/15 bg-black/30 lg:mx-0">

                    {profile?.portrait ? (

                      <img src={profile.portrait} alt={entry.nameFR} className="h-full w-full object-cover" />

                    ) : (

                      <ImagePlus className="h-10 w-10 text-gold/45" />

                    )}

                  </div>

                  <Input

                    type="file"

                    accept="image/*"

                    disabled={portraitBusy}

                    className="text-xs"

                    onChange={(e) => {

                      const file = e.target.files?.[0];

                      void onUploadPortrait(slug, file);

                      e.currentTarget.value = "";

                    }}

                  />

                  <p className="text-[10px] leading-5 text-muted-foreground">

                    {portraitBusy ? at.bioPortraitUploading : at.bioPortraitHint}

                  </p>

                </div>



                <div className="space-y-4">

                  <div className="space-y-3">

                    <div>

                      <Label className="text-xs uppercase tracking-[0.16em] text-gold/80">{at.bioSummary}</Label>

                      <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{at.bioSummaryHint}</p>

                    </div>

                    <div className="grid gap-3 md:grid-cols-2">

                      <div className="space-y-2">

                        <Label className="text-xs text-muted-foreground">{at.french}</Label>

                        <Textarea

                          value={summary.fr}

                          rows={5}

                          className="min-h-[120px] border-gold/15 bg-black/25"

                          onChange={(e) =>

                            setSummaryDrafts((current) => ({

                              ...current,

                              [slug]: { ...summary, fr: e.target.value },

                            }))

                          }

                        />

                      </div>

                      <div className="space-y-2">

                        <Label className="text-xs text-muted-foreground">{at.english}</Label>

                        <Textarea

                          value={summary.en}

                          rows={5}

                          className="min-h-[120px] border-gold/15 bg-black/25"

                          onChange={(e) =>

                            setSummaryDrafts((current) => ({

                              ...current,

                              [slug]: { ...summary, en: e.target.value },

                            }))

                          }

                        />

                      </div>

                    </div>

                    {isSummaryDirty(slug) ? (
                      <p className="text-xs text-amber-400">{at.bioSummaryUnsaved}</p>
                    ) : profiles[slug]?.summary?.fr || profiles[slug]?.summary?.en ? (
                      <p className="text-xs text-green-400">{at.bioSummarySaved}</p>
                    ) : null}

                    <Button
                      type="button"
                      size="sm"
                      className="gold-gradient-bg text-secondary-foreground"
                      disabled={summaryBusy}
                      onClick={() => void onSaveSummary(slug)}
                    >
                      {summaryBusy ? at.bioSummarySaving : at.bioSummarySave}
                    </Button>

                  </div>



                  <div className="space-y-3 border-t border-gold/10 pt-4">

                    <Label className="text-xs uppercase tracking-[0.16em] text-gold/80">{at.bioPdfSection}</Label>

                    <div className="grid gap-3 md:grid-cols-2">

                      {(["fr", "en"] as Lang[]).map((lang) => {

                        const filename = expectedFilename(slug, lang);

                        const exists = uploadedSet.has(filename);

                        const busy = uploadingKey === `${slug}-${lang}`;



                        return (

                          <div

                            key={lang}

                            className={`rounded-lg border p-3 ${

                              exists ? "border-green-500/25 bg-green-500/5" : "border-gold/12 bg-black/20"

                            }`}

                          >

                            <div className="flex items-center justify-between gap-2">

                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold/80">

                                {lang === "fr" ? at.french : at.english}

                              </p>

                              {exists ? (

                                <span className="inline-flex items-center gap-1 text-[10px] text-green-400">

                                  <CheckCircle2 className="h-3.5 w-3.5" />

                                  {at.bioOnline}

                                </span>

                              ) : (

                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-400">

                                  <AlertCircle className="h-3.5 w-3.5" />

                                  {at.bioMissing}

                                </span>

                              )}

                            </div>

                            <p className="mt-2 font-mono text-[11px] text-foreground/70">{filename}</p>

                            {exists ? (

                              <a

                                href={`/biographies/${filename}`}

                                target="_blank"

                                rel="noopener noreferrer"

                                className="mt-2 inline-block text-xs text-gold hover:underline"

                              >

                                {at.viewPdf}

                              </a>

                            ) : null}

                            <div className="mt-3">

                              <Input

                                type="file"

                                accept="application/pdf,.pdf"

                                disabled={busy}

                                className="text-xs"

                                onChange={(e) => {

                                  const file = e.target.files?.[0];

                                  void onUploadPdf(slug, lang, file);

                                  e.currentTarget.value = "";

                                }}

                              />

                              {busy ? (

                                <p className="mt-1 text-[10px] text-muted-foreground">{at.bioUploading}</p>

                              ) : (

                                <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">

                                  <Upload className="h-3 w-3" />

                                  {at.choosePdf}

                                </p>

                              )}

                            </div>

                          </div>

                        );

                      })}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}


