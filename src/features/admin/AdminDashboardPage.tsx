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
import { AdminLinksEditor, AdminTimelineEditor, AdminEconomyEditor } from "./content-list-editors";
import { MediaEditor } from "./MediaEditor";
import { PDFEditor } from "./PDFEditor";
import type { DirectoryItem, GovernanceBranch, PageLink, TimelineItem, UtilityCard } from "@/api/types";
import AdminGovernanceEditor from "@/features/governance/AdminGovernanceEditor";
import { resolveGovernanceData } from "@/features/governance/governance-content";
import AdminDirectoryEditor from "@/features/pages/AdminDirectoryEditor";
import AdminUtilityCardsEditor from "@/features/pages/AdminUtilityCardsEditor";
import { academyCardDefinitions, referenceBureauCardDefinitions } from "@/features/pages/utility-page-config";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Link, 
  Clock, 
  Users, 
  Globe, 
  Building2, 
  BookOpen, 
  DollarSign,
  Crown,
  LogOut,
  Save,
  RotateCcw,
  ChevronRight,
  Sparkles
} from "lucide-react";

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

function isDirectoryItemMeaningful(item: DirectoryItem): boolean {
  return Boolean(item.name?.en?.trim() || item.description?.en?.trim());
}

function isUtilityCardMeaningful(card: UtilityCard): boolean {
  return Boolean(card.title?.en?.trim() || card.description?.en?.trim() || card.url?.trim());
}

/** Same order as the public site sidebar — Introduction is always first. */
const PAGE_ORDER = [
  "introduction",
  "history",
  "governance",
  "global-perspectives",
  "reference-bureau",
  "academy",
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
  const isGlobalPerspectivesSection = current?.key === "global-perspectives";
  const isReferenceBureauSection = current?.key === "reference-bureau";
  const isAcademySection = current?.key === "academy";
  const isCultureSection = current?.key === "culture";
  const isResourcesSection = current?.key === "resources";
  const isEconomySection = current?.key === "economy";
  const isUtilityCardsSection = isReferenceBureauSection || isAcademySection;

  // Section icons mapping
  const sectionIcons: Record<string, React.ReactNode> = {
    introduction: <LayoutDashboard className="w-4 h-4" />,
    history: <Clock className="w-4 h-4" />,
    governance: <Crown className="w-4 h-4" />,
    economy: <DollarSign className="w-4 h-4" />,
    commerce: <Building2 className="w-4 h-4" />,
    culture: <Users className="w-4 h-4" />,
    resources: <BookOpen className="w-4 h-4" />,
    "global-perspectives": <Globe className="w-4 h-4" />,
    "reference-bureau": <FileText className="w-4 h-4" />,
    academy: <BookOpen className="w-4 h-4" />,
  };
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
      const directory = current.directory
        ? {
            countries: (current.directory.countries ?? []).filter(isDirectoryItemMeaningful),
            organizations: (current.directory.organizations ?? []).filter(isDirectoryItemMeaningful),
          }
        : current.directory;
      const utilityCards = (current.utilityCards ?? []).filter(isUtilityCardMeaningful);
      // Only save English content - French will be auto-translated on public site
      const title = { en: current.title?.en ?? "" };
      const content = { en: current.content?.en ?? "" };
      await updatePage.mutateAsync({
        id: current._id,
        token,
        patch: {
          title,
          content,
          images: current.key === "economy" ? [] : current.images,
          links: current.key === "history" || current.key === "economy" || current.key === "culture" ? [] : links,
          timeline: current.key === "history" ? timeline : current.timeline,
          governance: current.key === "governance" ? governance : current.governance,
          media: current.media,
          directory: current.key === "global-perspectives" ? directory : current.directory,
          utilityCards: current.key === "reference-bureau" || current.key === "academy" ? utilityCards : current.utilityCards,
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

  async function onUpload(files: File[]) {
    const uploadedUrls: string[] = [];
    let failedCount = 0;

    for (const file of files) {
      try {
        const res = await uploadFile(file, token);
        uploadedUrls.push(res.media.url);
      } catch {
        failedCount += 1;
      }
    }

    if (uploadedUrls.length > 0) {
      setDraft((prev) => {
        const base = prev ?? selected;
        if (!base) return prev;
        return { ...base, images: [...(base.images ?? []), ...uploadedUrls] };
      });
      toast.success(
        uploadedUrls.length === 1 ? "1 image uploaded" : `${uploadedUrls.length} images uploaded`
      );
    }

    if (failedCount > 0) {
      toast.error(
        failedCount === 1 ? "1 image failed to upload" : `${failedCount} images failed to upload`
      );
    }
  }

  function sectionNavLabel(key: string): string {
    const map: Record<string, string> = {
      introduction: t.introduction,
      history: t.history,
      governance: t.governance,
      "global-perspectives": t.globalPerspectives,
      "reference-bureau": t.referenceBureau,
      academy: t.academy,
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
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Sticky Sidebar */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {/* Main Sidebar Card */}
          <Card className="glass-panel p-5 border-gold/20 bg-gradient-to-b from-gold/5 to-transparent backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Header with Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-gold/20">
                  <Crown className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="font-display text-lg gold-gradient-text font-bold tracking-tight">Sanun Jara</div>
                  <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold/60" />
                    Admin Dashboard
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg"
                onClick={() => {
                  clearAdminToken();
                  toast.success("Signed out");
                  location.href = "/admin/login";
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            <Separator className="my-4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="rounded-lg bg-gold/5 border border-gold/10 p-2 text-center">
                <div className="text-lg font-bold text-gold">{pages.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Sections</div>
              </div>
              <div className="rounded-lg bg-gold/5 border border-gold/10 p-2 text-center">
                <div className="text-lg font-bold text-gold">{draft ? '•' : '✓'}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{draft ? 'Edited' : 'Saved'}</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-1 scrollbar-thin">
              {pages.map((p, index) => {
                const active = (current?._id ?? selected?._id) === p._id;
                return (
                  <motion.button
                    key={p._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group flex items-center gap-3 ${
                      active
                        ? "bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 shadow-lg shadow-gold/10"
                        : "hover:bg-gold/5 border border-transparent hover:border-gold/20"
                    }`}
                    onClick={() => select(p)}
                  >
                    <div className={`${active ? "text-gold" : "text-muted-foreground group-hover:text-gold/80"} transition-colors`}>
                      {sectionIcons[p.key] || <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-display text-sm font-semibold truncate ${active ? "text-gold" : "text-foreground/90 group-hover:text-gold/90"} transition-colors`}>
                        {sectionNavLabel(p.key)}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {localize(p.title) ? `"${localize(p.title).slice(0, 20)}${localize(p.title).length > 20 ? '...' : ''}"` : "/" + p.key}
                      </div>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-gold/60" />}
                  </motion.button>
                );
              })}
            </div>

            <Separator className="my-4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {/* Restore Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full glass-panel border-gold/30 hover:bg-gold/10 hover:border-gold/50 text-xs transition-all duration-300"
              disabled={ensurePages.isPending}
              onClick={() => void restoreMissingSections()}
            >
              {ensurePages.isPending ? (
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-3 h-3 animate-spin" />
                  Syncing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  Restore missing sections
                </span>
              )}
            </Button>
          </Card>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!current ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-panel p-6 sm:p-8 border-gold/20 bg-gradient-to-b from-gold/5 to-transparent backdrop-blur-xl min-h-[400px] flex items-center justify-center">
                  {pagesQuery.isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center animate-pulse">
                        <Crown className="w-6 h-6 text-black" />
                      </div>
                      <span className="text-muted-foreground flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading sections...
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gold/60" />
                      </div>
                      <p className="text-muted-foreground">No pages found. Start the server to seed pages.</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={current._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-panel p-6 sm:p-8 border-gold/20 bg-gradient-to-b from-gold/5 to-transparent backdrop-blur-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gold/10">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-gold/20 shrink-0">
                        {sectionIcons[current.key] || <FileText className="w-7 h-7 text-black" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-bold gold-gradient-text">{sectionNavLabel(current.key)}</h2>
                          {current.key === "introduction" && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-gold/20 text-gold rounded-full border border-gold/30">HOME PAGE</span>
                          )}
                          {draft && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Unsaved
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">
                          /{current.key === "introduction" ? "" : current.key}
                        </p>
                      </div>
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
                          <Save className="w-4 h-4" />
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
                  isHistorySection || isGovernanceSection || isGlobalPerspectivesSection || isCultureSection || isResourcesSection || isUtilityCardsSection
                    ? "border-gold/18 bg-[linear-gradient(155deg,rgba(255,205,86,0.08),rgba(0,0,0,0.15))] shadow-[0_22px_70px_rgba(0,0,0,0.14)]"
                    : "border-gold/10 bg-black/10"
                }`}
              >
                {isHistorySection || isGovernanceSection || isGlobalPerspectivesSection || isCultureSection || isResourcesSection || isUtilityCardsSection ? (
                  <div className="flex flex-col gap-3 rounded-[1.2rem] border border-gold/12 bg-black/25 p-4 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        {isHistorySection
                          ? "History page content"
                          : isGovernanceSection
                            ? "Governance page content"
                            : isGlobalPerspectivesSection
                              ? "Global Perspectives content"
                              : isCultureSection
                                ? "Culture page content"
                                : isResourcesSection
                                  ? "Resources page content"
                                  : isReferenceBureauSection
                                    ? "Reference Bureau content"
                                    : "Academy content"}
                      </p>
                      <p className="mt-1 max-w-2xl leading-6">
                        {isHistorySection
                          ? "This section controls every visible History page detail except the loading state: title, narrative, images, and timeline."
                          : isGovernanceSection
                            ? "Use this area for the public governance page title and overview copy. The structured offices, indexes, and branches are edited below."
                            : isGlobalPerspectivesSection
                              ? "Use this area for the Global Perspectives heading and introductory text. Countries and organizations are edited in the directory section below."
                              : isCultureSection
                                ? "Use this area for the Culture page title and introduction. Upload gallery images below and add culture videos in the media section."
                                : isResourcesSection
                                  ? "Use this area for the public Resources page title and overview. Add external links and PDF documents in the sections below."
                                  : isReferenceBureauSection
                                    ? "Use this area for the Reference Bureau heading and intro. The three dropdown items are edited in the card section below."
                                    : "Use this area for the Academy heading and intro. The course items shown in the dropdown are edited in the card section below."}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="group">
                  <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                    <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                    {isHistorySection
                      ? "History title"
                      : isGovernanceSection
                        ? "Governance title"
                        : isGlobalPerspectivesSection
                          ? "Global Perspectives title"
                          : isCultureSection
                            ? "Culture title"
                            : isResourcesSection
                              ? "Resources title"
                              : isReferenceBureauSection
                                ? "Reference Bureau title"
                                : isAcademySection
                                  ? "Academy title"
                          : "Title"}
                  </Label>
                  <Input
                    className="glass-panel border-gold/20 bg-black/20 transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                    placeholder={
                      isHistorySection
                        ? "Enter the public History page title..."
                        : isGovernanceSection
                          ? "Enter the public Governance page title..."
                        : isGlobalPerspectivesSection
                            ? "Enter the public Global Perspectives page title..."
                            : isCultureSection
                              ? "Enter the public Culture page title..."
                              : isResourcesSection
                                ? "Enter the public Resources page title..."
                                : isReferenceBureauSection
                                  ? "Enter the public Reference Bureau title..."
                                  : isAcademySection
                                    ? "Enter the public Academy title..."
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
                    {isHistorySection
                      ? "Historical narrative"
                      : isGovernanceSection
                        ? "Governance overview"
                        : isGlobalPerspectivesSection
                          ? "Global Perspectives overview"
                          : isCultureSection
                            ? "Culture introduction"
                            : isResourcesSection
                              ? "Resources overview"
                              : isReferenceBureauSection
                                ? "Reference Bureau introduction"
                                : isAcademySection
                                  ? "Academy introduction"
                          : "Content"}
                  </Label>
                  <Textarea
                    className="min-h-48 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                    placeholder={
                      isHistorySection
                        ? "Write the public historical overview. Separate paragraphs with a blank line."
                        : isGovernanceSection
                          ? "Write the governance introduction. Separate paragraphs with a blank line."
                          : isGlobalPerspectivesSection
                            ? "Write the introductory text for the country and organization directories."
                            : isCultureSection
                              ? "Write the introductory text for the Culture page. Separate paragraphs with a blank line."
                              : isResourcesSection
                                ? "Write the introduction for the Resources page. Separate paragraphs with a blank line."
                                : isReferenceBureauSection
                                  ? "Write the introduction for the Reference Bureau page."
                                  : isAcademySection
                                    ? "Write the introduction for the Academy page."
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
                        : isGlobalPerspectivesSection
                          ? "This introduction appears above the country and organization lists. Text auto-translates to French."
                          : isCultureSection
                            ? "This introduction appears above the culture gallery and video sections. Text auto-translates to French."
                            : isResourcesSection
                              ? "This introduction appears above the resource links and document library. Text auto-translates to French."
                              : isReferenceBureauSection
                                ? "This introduction appears above the join, questions, and entrepreneur sections. Text auto-translates to French."
                                : isAcademySection
                                  ? "This introduction appears above the course sections. Text auto-translates to French."
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

              {isGlobalPerspectivesSection ? (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminDirectoryEditor
                    directory={current.directory ?? { countries: [], organizations: [] }}
                    onChange={(directory) => setDraft({ ...current, directory })}
                  />
                </>
              ) : null}

              {isEconomySection ? (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminEconomyEditor
                    economy={current.economy}
                    onChange={(economy) => setDraft({ ...current, economy })}
                  />
                </>
              ) : null}

              {current.key !== "introduction" && current.key !== "resources" && current.key !== "global-perspectives" && current.key !== "economy" && current.key !== "reference-bureau" && current.key !== "academy" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="space-y-4 rounded-xl border border-gold/10 bg-gradient-to-br from-gold/5 to-transparent p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Label className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                          {isGovernanceSection ? "Governance visuals" : isCultureSection ? "Culture images" : "Images"}
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {isCultureSection
                            ? "Upload one or many images. They will appear in the public culture gallery."
                            : "Upload one or many images for this page."}
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="w-auto glass-panel border-gold/20 text-xs"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          if (files.length > 0) void onUpload(files);
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
                          : isCultureSection
                            ? "No culture images uploaded yet."
                          : "No images uploaded yet."}
                      </div>
                    )}
                  </div>
                </>
              )}

              {current.key !== "introduction" && current.key !== "history" && current.key !== "global-perspectives" && current.key !== "economy" && current.key !== "culture" && current.key !== "reference-bureau" && current.key !== "academy" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminLinksEditor
                    links={current.links ?? []}
                    onChange={(links) => setDraft({ ...current, links })}
                    title={isGovernanceSection ? "Sources" : isResourcesSection ? "Resource Links" : undefined}
                    description={
                      isGovernanceSection
                        ? "Add reference entries for the public governance page. You can provide a label only, or a label with a full URL."
                        : isResourcesSection
                          ? "Add helpful external resources for the public Resources page. Each entry can point to a website, archive, report, or related document."
                          : undefined
                    }
                    addLabel={isGovernanceSection ? "Add Source" : isResourcesSection ? "Add Resource Link" : undefined}
                    emptyMessage={
                      isGovernanceSection
                        ? "No sources yet. Click Add Source to create the governance reference list."
                        : isResourcesSection
                          ? "No external resources yet. Click Add Resource Link to create one."
                          : undefined
                    }
                    itemLabel={isGovernanceSection ? "Source" : isResourcesSection ? "Resource" : undefined}
                    urlFieldLabel={isResourcesSection ? "Resource URL" : undefined}
                    labelFieldLabel={isGovernanceSection ? "Source label" : isResourcesSection ? "Resource label" : undefined}
                    urlPlaceholder={isResourcesSection ? "https://example.com/resource" : undefined}
                    labelPlaceholder={isGovernanceSection ? "e.g. Le Djeliba" : isResourcesSection ? "e.g. UNESCO archive" : undefined}
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

              {isUtilityCardsSection ? (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminUtilityCardsEditor
                    title={isReferenceBureauSection ? "Reference Bureau Items" : "Academy Courses"}
                    description={
                      isReferenceBureauSection
                        ? "Edit the three cards linked from the Reference Bureau dropdown: join, questions, and entrepreneur."
                        : "Edit the three course cards linked from the Academy dropdown."
                    }
                    cards={current.utilityCards ?? []}
                    definitions={isReferenceBureauSection ? referenceBureauCardDefinitions : academyCardDefinitions}
                    onChange={(utilityCards) => setDraft({ ...current, utilityCards })}
                  />
                </>
              ) : null}

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
            </Card>
          </motion.div>
  )}
</AnimatePresence>
      </div>
    </div>
  </div>
  );
}

