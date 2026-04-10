import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import type { Page } from "@/api/types";
import { usePages, useUpdatePage, useEnsurePages } from "@/api/pages";
import { clearAdminToken, getAdminToken } from "@/api/auth";
import { uploadFile } from "@/api/upload";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AdminLinksEditor, AdminTimelineEditor } from "./content-list-editors";
import { MediaEditor } from "./MediaEditor";
import { PDFEditor } from "./PDFEditor";
import type { GovernanceBranch, PageLink, TimelineItem } from "@/api/types";
import AdminGovernanceEditor from "@/features/governance/AdminGovernanceEditor";
import { resolveGovernanceData } from "@/features/governance/governance-content";

function isLinkMeaningful(l: PageLink): boolean {
  return Boolean(
    l.url?.trim() || l.label?.en?.trim()
  );
}

function isTimelineMeaningful(t: TimelineItem): boolean {
  return Boolean(
    t.year?.trim() ||
      t.title?.en?.trim() ||
      t.description?.en?.trim()
  );
}

function isGovernanceBranchMeaningful(branch: GovernanceBranch): boolean {
  return Boolean(
    branch.name?.en?.trim() ||
      branch.powers?.en?.trim() ||
      branch.selection?.en?.trim()
  );
}

/** Same order as the public site sidebar — Introduction is always first. */
const PAGE_ORDER = [
  "introduction",
  "history",
  "governance",
  "economy",
  "commerce",
  "culture",
  "resources",
] as const;

function sortPagesLikeSite(pages: Page[]): Page[] {
  const rank = (key: string) => {
    const i = PAGE_ORDER.indexOf(key as (typeof PAGE_ORDER)[number]);
    return i === -1 ? PAGE_ORDER.length : i;
  };
  return [...pages].sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key));
}

function splitEditorParagraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function AdminDashboardPage() {
  const token = getAdminToken();
  const { localize, t } = useI18n();
  const pagesQuery = usePages();
  const updatePage = useUpdatePage();
  const ensurePages = useEnsurePages();

  const pages = useMemo(
    () => sortPagesLikeSite(pagesQuery.data?.pages ?? []),
    [pagesQuery.data?.pages]
  );
  const [selectedId, setSelectedId] = useState<string>("");

  const selected = useMemo(() => pages.find((p) => p._id === selectedId) ?? pages[0], [pages, selectedId]);

  useEffect(() => {
    if (!pages.length) return;
    const stillValid = selectedId && pages.some((p) => p._id === selectedId);
    if (stillValid) return;
    const intro = pages.find((p) => p.key === "introduction");
    setSelectedId(intro?._id ?? pages[0]._id);
  }, [pages, selectedId]);
  const [draft, setDraft] = useState<Page | null>(null);

  const current = draft ?? selected ?? null;
  const isHistorySection = current?.key === "history";
  const isGovernanceSection = current?.key === "governance";
  const historyParagraphs = splitEditorParagraphs(current?.content?.en ?? "");
  const historyEventCount = current?.timeline?.filter(isTimelineMeaningful).length ?? 0;
  const historyImageCount = current?.images?.length ?? 0;
  const governanceData = resolveGovernanceData(current ?? undefined);

  if (!token) return <Navigate to="/admin/login" replace />;

  function select(p: Page) {
    setSelectedId(p._id);
    setDraft(p);
  }

  async function save() {
    if (!current) return;
    try {
      const links = (current.links ?? []).filter(isLinkMeaningful);
      const timeline = (current.timeline ?? []).filter(isTimelineMeaningful);
      const governance = {
        ...resolveGovernanceData(current),
        branches: resolveGovernanceData(current).branches.filter(isGovernanceBranchMeaningful),
      };
      // Only save English content - French will be auto-translated on public site
      const title = { en: current.title?.en ?? "" };
      const content = { en: current.content?.en ?? "" };
      await updatePage.mutateAsync({
        id: current._id,
        token,
        patch: {
          title,
          content,
          images: current.images,
          links: current.key === "history" ? [] : links,
          timeline: current.key === "history" ? timeline : current.timeline,
          governance: current.key === "governance" ? governance : current.governance,
          media: current.media,
        },
      });
      toast.success("Saved");
      setDraft(null);
    } catch (e) {
      toast.error("Save failed");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async function onUpload(file: File) {
    try {
      const res = await uploadFile(file, token);
      const url = res.media.url;
      setDraft((prev) => {
        const base = prev ?? selected;
        if (!base) return prev;
        return { ...base, images: [...(base.images ?? []), url] };
      });
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    }
  }

  function sectionNavLabel(key: string): string {
    const map: Record<string, string> = {
      introduction: t.introduction,
      history: t.history,
      governance: t.governance,
      economy: t.economy,
      commerce: t.commerce,
      culture: t.culture,
      resources: t.resources,
    };
    return map[key] ?? key;
  }

  async function restoreMissingSections() {
    try {
      await ensurePages.mutateAsync(token);
      toast.success("Sections synced (missing defaults were added)");
    } catch {
      toast.error("Could not restore sections");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/95 to-amber-950/20 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <Card className="glass-panel p-5 h-fit border-gold/20 bg-gradient-to-b from-gold/5 to-transparent backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-gold/20">
                <span className="text-black font-bold text-lg">SJ</span>
              </div>
              <div>
                <div className="font-display text-lg gold-gradient-text font-bold tracking-tight">Sanun Jara</div>
                <div className="text-xs text-muted-foreground font-medium">Admin Dashboard</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-gold hover:bg-gold/10"
              onClick={() => {
                clearAdminToken();
                toast.success("Signed out");
                location.href = "/admin/login";
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections</span>
              <span className="text-[10px] text-gold/70 bg-gold/10 px-2 py-0.5 rounded-full">{pages.length}</span>
            </div>
            {pages.map((p) => {
              const active = (current?._id ?? selected?._id) === p._id;
              return (
                <button
                  key={p._id}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? "bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 shadow-lg shadow-gold/10"
                      : "hover:bg-gold/5 border border-transparent hover:border-gold/20"
                  }`}
                  onClick={() => select(p)}
                >
                  <div className={`font-display text-sm font-semibold ${active ? "text-gold" : "text-foreground/90 group-hover:text-gold/90"} transition-colors`}>
                    {sectionNavLabel(p.key)}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {localize(p.title) ? `"${localize(p.title).slice(0, 25)}${localize(p.title).length > 25 ? '...' : ''}" · ` : ""}
                    <span className="font-mono text-gold/60">/{p.key}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <Button
            type="button"
            variant="outline"
            className="w-full glass-panel border-gold/30 hover:bg-gold/10 hover:border-gold/50 text-xs transition-all duration-300"
            disabled={ensurePages.isPending}
            onClick={() => void restoreMissingSections()}
          >
            {ensurePages.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restore missing sections
              </span>
            )}
          </Button>
        </Card>

        <Card className="glass-panel p-6 sm:p-8 border-gold/20 bg-gradient-to-b from-gold/5 to-transparent backdrop-blur-xl">
          {!current ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              {pagesQuery.isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : "No pages found. Start the server to seed pages."}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gold/10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold gold-gradient-text">{sectionNavLabel(current.key)}</h2>
                    {current.key === "introduction" && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-gold/20 text-gold rounded-full border border-gold/30">HOME PAGE</span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    /{current.key === "introduction" ? "" : current.key}
                  </p>
                </div>
                <Button
                  onClick={save}
                  disabled={updatePage.isPending}
                  className="gold-gradient-bg text-black font-bold px-6 shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all duration-300 hover:scale-105"
                >
                  {updatePage.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>

              {isHistorySection ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "Narrative blocks",
                      value: historyParagraphs.length,
                      note: "Paragraph groups pulled from the main content field.",
                    },
                    {
                      label: "Timeline events",
                      value: historyEventCount,
                      note: "Ordered entries visible on the public chronology.",
                    },
                    {
                      label: "Gallery images",
                      value: historyImageCount,
                      note: "Optional visuals displayed with the History page.",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.4rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(255,205,86,0.08),rgba(255,205,86,0.02))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.12)]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">{item.label}</p>
                      <p className="mt-3 text-3xl font-display font-semibold text-foreground">{String(item.value).padStart(2, "0")}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              <div
                className={`space-y-6 rounded-[1.6rem] border p-5 sm:p-6 ${
                  isHistorySection || isGovernanceSection
                    ? "border-gold/18 bg-[linear-gradient(155deg,rgba(255,205,86,0.08),rgba(0,0,0,0.15))] shadow-[0_22px_70px_rgba(0,0,0,0.14)]"
                    : "border-gold/10 bg-black/10"
                }`}
              >
                {isHistorySection || isGovernanceSection ? (
                  <div className="flex flex-col gap-3 rounded-[1.2rem] border border-gold/12 bg-black/25 p-4 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        {isHistorySection ? "History page content" : "Governance page content"}
                      </p>
                      <p className="mt-1 max-w-2xl leading-6">
                        {isHistorySection
                          ? "This section controls every visible History page detail except the loading state: title, narrative, images, and timeline."
                          : "Use this area for the public governance page title and overview copy. The structured offices, indexes, and branches are edited below."}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="group">
                  <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                    <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                    {isHistorySection ? "History title" : isGovernanceSection ? "Governance title" : "Title"}
                  </Label>
                  <Input
                    className="glass-panel border-gold/20 bg-black/20 transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                    placeholder={
                      isHistorySection
                        ? "Enter the public History page title..."
                        : isGovernanceSection
                          ? "Enter the public Governance page title..."
                          : "Enter page title..."
                    }
                    value={current.title?.en ?? ""}
                    onChange={(e) =>
                      setDraft({ ...current, title: { ...(current.title ?? {}), en: e.target.value } })
                    }
                  />
                </div>

                <div className="group">
                  <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                    <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                    {isHistorySection ? "Historical narrative" : isGovernanceSection ? "Governance overview" : "Content"}
                  </Label>
                  <Textarea
                    className="min-h-48 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                    placeholder={
                      isHistorySection
                        ? "Write the public historical overview. Separate paragraphs with a blank line."
                        : isGovernanceSection
                          ? "Write the governance introduction. Separate paragraphs with a blank line."
                          : "Enter page content..."
                    }
                    value={current.content?.en ?? ""}
                    onChange={(e) =>
                      setDraft({ ...current, content: { ...(current.content ?? {}), en: e.target.value } })
                    }
                  />
                  <p className="mt-2 text-xs text-muted-foreground/80">
                    {isHistorySection
                      ? "Each paragraph becomes a clean content block on the public History page. Text auto-translates to French."
                      : isGovernanceSection
                        ? "These paragraphs appear at the top of the public Governance page. Text auto-translates to French."
                        : "Content auto-translates to French on the public site."}
                  </p>
                </div>
              </div>

              {isGovernanceSection ? (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminGovernanceEditor
                    governance={governanceData}
                    onChange={(governance) => setDraft({ ...current, governance })}
                  />
                </>
              ) : null}

              {current.key !== "introduction" && current.key !== "resources" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="space-y-4 rounded-xl border border-gold/10 bg-gradient-to-br from-gold/5 to-transparent p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Label className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                          {isGovernanceSection ? "Governance visuals" : "Images"}
                        </Label>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground/80">
                          {isHistorySection
                            ? "Upload supporting images for the History page hero and gallery."
                            : isGovernanceSection
                              ? "The first image appears as the flag and the second image appears as the coat of arms on the public Governance page."
                              : "Upload images to display on the public page."}
                        </p>
                      </div>
                      <Input
                        type="file"
                        className="w-auto glass-panel border-gold/20 text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void onUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </div>
                    {(current.images ?? []).length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {(current.images ?? []).map((url, index) => (
                          <div key={url} className="relative group/image">
                            <img
                              src={url}
                              alt=""
                              className="h-24 w-full rounded-lg border border-gold/20 object-cover transition-all group-hover/image:border-gold/40"
                            />
                            {isGovernanceSection && index < 2 ? (
                              <span className="absolute bottom-2 left-2 rounded-full border border-gold/25 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/85">
                                {index === 0 ? "Flag" : "Coat of arms"}
                              </span>
                            ) : null}
                            <button
                              type="button"
                              className="absolute -right-2 -top-2 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs glass-panel opacity-0 transition-opacity group-hover/image:opacity-100 hover:bg-red-500/40"
                              onClick={() =>
                                setDraft({
                                  ...current,
                                  images: (current.images ?? []).filter((_, imageIndex) => imageIndex !== index),
                                })
                              }
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-8 text-sm text-muted-foreground">
                        {isGovernanceSection
                          ? "No custom governance visuals uploaded yet. The public page will use the default flag and coat of arms until you add your own."
                          : "No images uploaded yet."}
                      </div>
                    )}
                  </div>
                </>
              )}

              {current.key !== "introduction" && current.key !== "history" && current.key !== "resources" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminLinksEditor
                    links={current.links ?? []}
                    showDonationHint={current.key === "economy"}
                    onChange={(links) => setDraft({ ...current, links })}
                    title={isGovernanceSection ? "Sources" : undefined}
                    description={
                      isGovernanceSection
                        ? "Add reference entries for the public governance page. You can provide a label only, or a label with a full URL."
                        : undefined
                    }
                    addLabel={isGovernanceSection ? "Add Source" : undefined}
                    emptyMessage={
                      isGovernanceSection
                        ? "No sources yet. Click Add Source to create the governance reference list."
                        : undefined
                    }
                    itemLabel={isGovernanceSection ? "Source" : undefined}
                    labelFieldLabel={isGovernanceSection ? "Source label" : undefined}
                    labelPlaceholder={isGovernanceSection ? "e.g. Le Djeliba" : undefined}
                  />
                </>
              )}

              {current.key === "history" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminTimelineEditor
                    timeline={current.timeline ?? []}
                    onChange={(timeline) => setDraft({ ...current, timeline })}
                  />
                </>
              )}

              {current.key === "culture" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <MediaEditor
                    media={current.media ?? []}
                    onChange={(media) => setDraft({ ...current, media })}
                    token={token}
                  />
                </>
              )}

              {current.key === "resources" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <PDFEditor
                    pdfs={current.media ?? []}
                    onChange={(media) => setDraft({ ...current, media })}
                    token={token}
                  />
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

