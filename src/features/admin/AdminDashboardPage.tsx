import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import type { Page, Content } from "@/api/types";
import { usePages, useUpdatePage, useEnsurePages } from "@/api/pages";
import { useAllContent, useCreateContent, useUpdateContent, useDeleteContent } from "@/api/content";
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
import AdminBiographiesEditor from "../governance/AdminBiographiesEditor";
import AdminGovernanceEditor from "../governance/AdminGovernanceEditor";
import AdminUtilityCardsEditor from "../pages/AdminUtilityCardsEditor";
import { AdminInstitutionsEditor } from "../governance/AdminInstitutionsEditor";
import { AdminArchitecturalProjectsEditor } from "../governance/AdminArchitecturalProjectsEditor";
import { MediaEditor } from "./MediaEditor";
import { PDFEditor } from "./PDFEditor";
import type { BiographyItem, DirectoryItem, GovernanceBranch, PageLink, TimelineItem, UtilityCard } from "@/api/types";
import { resolveGovernanceData } from "@/features/governance/governance-content";
import AdminDirectoryEditor from "@/features/pages/AdminDirectoryEditor";
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
  Sparkles,
  Plus,
  Trash2,
  FolderOpen,
  Layers,
  AlertCircle
} from "lucide-react";

function isLinkMeaningful(l: PageLink): boolean {
  return Boolean(
    l.url?.trim() || l.label?.fr?.trim()
  );
}

function isTimelineMeaningful(t: TimelineItem): boolean {
  return Boolean(
    t.year?.trim() ||
      t.title?.fr?.trim() ||
      t.description?.fr?.trim()
  );
}

function isGovernanceBranchMeaningful(branch: GovernanceBranch): boolean {
  return Boolean(
    branch.name?.fr?.trim() ||
      branch.powers?.fr?.trim() ||
      branch.selection?.fr?.trim()
  );
}

function isDirectoryItemMeaningful(item: DirectoryItem): boolean {
  return Boolean(item.name?.fr?.trim() || item.description?.fr?.trim());
}

function isUtilityCardMeaningful(card: UtilityCard): boolean {
  return Boolean(card.title?.fr?.trim() || card.description?.fr?.trim() || card.url?.trim());
}

function isBiographyMeaningful(bio: BiographyItem): boolean {
  return Boolean(bio.slug?.trim() || bio.name?.fr?.trim() || bio.name?.en?.trim());
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
  "niani",
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

  // Content management state
  const [activeTab, setActiveTab] = useState<"pages" | "content">("pages");
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [contentDraft, setContentDraft] = useState<Content | null>(null);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [newContentSlug, setNewContentSlug] = useState("");
  const contentQuery = useAllContent(token);
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  const current = draft ?? selected ?? null;
  const isHistorySection = current?.key === "history";
  const isGovernanceSection = current?.key === "governance";
  const isGlobalPerspectivesSection = current?.key === "global-perspectives";
  const isReferenceBureauSection = current?.key === "reference-bureau";
  const isAcademySection = current?.key === "academy";
  const isCultureSection = current?.key === "culture";
  const isResourcesSection = current?.key === "resources";
  const isEconomySection = current?.key === "economy";
  const isNianiSection = current?.key === "niani";
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
  const historyParagraphs = splitEditorParagraphs(current?.content?.fr ?? "");
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
      const biographies = (current.biographies ?? []).filter(isBiographyMeaningful);
      // Save both English and French content
      const title = { en: current.title?.en ?? "", fr: current.title?.fr ?? "" };
      const content = { en: current.content?.en ?? "", fr: current.content?.fr ?? "" };
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
          biographies: current.key === "governance" ? biographies : current.biographies,
          institutions: current.key === "niani" ? current.institutions : current.institutions,
          architecturalProjects: current.key === "niani" ? current.architecturalProjects : current.architecturalProjects,
          featuredImage: current.featuredImage,
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

  // Content management helpers
  const contentItems = useMemo(
    () => contentQuery.data?.content ?? [],
    [contentQuery.data?.content]
  );

  const selectedContent = useMemo(
    () => contentItems.find((c) => c._id === selectedContentId) ?? contentItems[0] ?? null,
    [contentItems, selectedContentId]
  );

  const currentContent = contentDraft ?? selectedContent ?? null;

  function selectContent(c: Content) {
    setSelectedContentId(c._id);
    setContentDraft(c);
    setIsCreatingContent(false);
    setNewContentSlug("");
  }

  async function saveContent() {
    if (!currentContent || !currentContent._id) return;
    try {
      await updateContent.mutateAsync({
        id: currentContent._id,
        token,
        data: {
          title: currentContent.title,
          content: currentContent.content,
          icon: currentContent.icon,
          order: currentContent.order,
          images: currentContent.images,
          links: currentContent.links,
          isPublished: currentContent.isPublished,
        },
      });
      toast.success("Content saved");
      setContentDraft(null);
    } catch (e) {
      toast.error("Failed to save content");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async function handleCreateContent() {
    if (!newContentSlug.trim()) return;
    try {
      await createContent.mutateAsync({
        token,
        data: {
          slug: newContentSlug.toLowerCase().replace(/\s+/g, "-"),
          title: { en: "", fr: "" },
          content: { en: "", fr: "" },
          icon: "FileText",
          order: contentItems.length,
          images: [],
          links: [],
          isPublished: true,
        },
      });
      toast.success("Content created");
      setIsCreatingContent(false);
      setNewContentSlug("");
    } catch (e) {
      if (e instanceof Error && e.message.includes("409")) {
        toast.error("A content item with this slug already exists");
      } else {
        toast.error("Failed to create content");
      }
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async function handleDeleteContent(id: string) {
    try {
      await deleteContent.mutateAsync({ id, token });
      toast.success("Content deleted");
      if (selectedContentId === id) {
        setSelectedContentId("");
        setContentDraft(null);
      }
    } catch (e) {
      toast.error("Failed to delete content");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  async function onUploadContentImages(files: File[]) {
    if (!currentContent) return;
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
      setContentDraft((prev) => {
        const base = prev ?? selectedContent;
        if (!base) return prev;
        return { ...base, images: [...(base.images ?? []), ...uploadedUrls] };
      });
      toast.success(uploadedUrls.length === 1 ? "1 image uploaded" : `${uploadedUrls.length} images uploaded`);
    }

    if (failedCount > 0) {
      toast.error(failedCount === 1 ? "1 image failed to upload" : `${failedCount} images failed to upload`);
    }
  }

  function getContentIcon(iconName: string) {
    const icons: Record<string, React.ReactNode> = {
      FileText: <FileText className="w-4 h-4" />,
      LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
      Clock: <Clock className="w-4 h-4" />,
      Crown: <Crown className="w-4 h-4" />,
      DollarSign: <DollarSign className="w-4 h-4" />,
      Building2: <Building2 className="w-4 h-4" />,
      Users: <Users className="w-4 h-4" />,
      BookOpen: <BookOpen className="w-4 h-4" />,
      Globe: <Globe className="w-4 h-4" />,
      FolderOpen: <FolderOpen className="w-4 h-4" />,
      Layers: <Layers className="w-4 h-4" />,
    };
    return icons[iconName] || <FileText className="w-4 h-4" />;
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

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("pages")}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === "pages"
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Pages
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === "content"
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Content
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="rounded-lg bg-gold/5 border border-gold/10 p-2 text-center">
                <div className="text-lg font-bold text-gold">
                  {activeTab === "pages" ? pages.length : contentItems.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {activeTab === "pages" ? "Sections" : "Items"}
                </div>
              </div>
              <div className="rounded-lg bg-gold/5 border border-gold/10 p-2 text-center">
                <div className="text-lg font-bold text-gold">
                  {activeTab === "pages" ? (draft ? '•' : '✓') : (contentDraft ? '•' : '✓')}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {activeTab === "pages" ? (draft ? 'Edited' : 'Saved') : (contentDraft ? 'Edited' : 'Saved')}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-1 scrollbar-thin">
              {activeTab === "pages" ? (
                // Pages list
                pages.map((p, index) => {
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
                })
              ) : (
                // Content list
                <>
                  {contentItems.length === 0 && !isCreatingContent && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No custom content yet. Click below to add one.
                    </div>
                  )}
                  {isCreatingContent ? (
                    <div className="p-3 rounded-xl border border-gold/30 bg-gold/5">
                      <Label className="text-xs mb-2 block">New Content Slug</Label>
                      <Input
                        value={newContentSlug}
                        onChange={(e) => setNewContentSlug(e.target.value)}
                        placeholder="e.g. religion, civilization"
                        className="mb-2 glass-panel border-gold/20 text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground mb-3">
                        Use lowercase letters and hyphens only
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 gold-gradient-bg text-black text-xs"
                          onClick={() => void handleCreateContent()}
                          disabled={!newContentSlug.trim() || createContent.isPending}
                        >
                          {createContent.isPending ? "Creating..." : "Create"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            setIsCreatingContent(false);
                            setNewContentSlug("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-gold/30 hover:bg-gold/10 text-xs"
                      onClick={() => setIsCreatingContent(true)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add New Content
                    </Button>
                  )}
                  {contentItems.map((c, index) => {
                    const active = selectedContentId === c._id;
                    return (
                      <motion.div
                        key={c._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative ${
                          active
                            ? "bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/40 shadow-lg shadow-gold/10"
                            : "hover:bg-gold/5 border border-transparent hover:border-gold/20"
                        } rounded-xl transition-all duration-300`}
                      >
                        <button
                          type="button"
                          onClick={() => selectContent(c)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3"
                        >
                          <div className={`${active ? "text-gold" : "text-muted-foreground group-hover:text-gold/80"} transition-colors`}>
                            {getContentIcon(c.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-display text-sm font-semibold truncate ${active ? "text-gold" : "text-foreground/90 group-hover:text-gold/90"} transition-colors`}>
                              {localize(c.title) || c.slug}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              /content/{c.slug}
                            </div>
                          </div>
                          {active && <ChevronRight className="w-4 h-4 text-gold/60" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(c._id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                          title="Delete content"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>

            <Separator className="my-4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {/* Restore Button (only in pages tab) */}
            {activeTab === "pages" && (
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
            )}
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
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">English</span>
                      <Input
                        className="glass-panel border-gold/20 bg-black/20 transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                        placeholder="English title..."
                        value={current.title?.en ?? ""}
                        onChange={(e) =>
                          setDraft({ ...current, title: { ...(current.title ?? {}), en: e.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">Français</span>
                      <Input
                        className="glass-panel border-gold/20 bg-black/20 transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                        placeholder="Titre en français..."
                        value={current.title?.fr ?? ""}
                        onChange={(e) =>
                          setDraft({ ...current, title: { ...(current.title ?? {}), fr: e.target.value } })
                        }
                      />
                    </div>
                  </div>
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
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">English</span>
                      <Textarea
                        className="min-h-48 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                        placeholder="English content..."
                        value={current.content?.en ?? ""}
                        onChange={(e) =>
                          setDraft({ ...current, content: { ...(current.content ?? {}), en: e.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">Français</span>
                      <Textarea
                        className="min-h-48 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                        placeholder="Contenu en français..."
                        value={current.content?.fr ?? ""}
                        onChange={(e) =>
                          setDraft({ ...current, content: { ...(current.content ?? {}), fr: e.target.value } })
                        }
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground/80">
                    {isHistorySection
                      ? "Each paragraph becomes a clean content block on the public History page. Text auto-translates to English."
                      : isGovernanceSection
                        ? "These paragraphs appear at the top of the public Governance page. Text auto-translates to English."
                        : isGlobalPerspectivesSection
                          ? "This introduction appears above the country and organization lists. Text auto-translates to English."
                          : isCultureSection
                            ? "This introduction appears above the culture gallery and video sections. Text auto-translates to English."
                            : isResourcesSection
                              ? "This introduction appears above the resource links and document library. Text auto-translates to English."
                              : isReferenceBureauSection
                                ? "This introduction appears above the join, questions, and entrepreneur sections. Text auto-translates to English."
                                : isAcademySection
                                  ? "This introduction appears above the course sections. Text auto-translates to English."
                        : "Content auto-translates to English on the public site."}
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
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminBiographiesEditor
                    biographies={current.biographies ?? []}
                    onChange={(biographies) => setDraft({ ...current, biographies })}
                    token={token}
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

              {current.key !== "resources" && current.key !== "global-perspectives" && current.key !== "economy" && current.key !== "reference-bureau" && current.key !== "academy" && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  
                  {/* Featured Image Section */}
                  <div className="space-y-4 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5 mb-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Label className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                          Featured Image
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          This image appears next to the Coat of Arms on all pages. Upload one image.
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="w-auto glass-panel border-gold/20 text-xs"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const res = await uploadFile(file, token);
                            setDraft({ ...current, featuredImage: res.media.url });
                            toast.success("Featured image uploaded");
                          } catch {
                            toast.error("Failed to upload featured image");
                          }
                          e.currentTarget.value = "";
                        }}
                      />
                    </div>
                    {current.featuredImage ? (
                      <div className="relative group/featured">
                        <img
                          src={current.featuredImage}
                          alt="Featured"
                          className="h-32 w-full rounded-lg border border-gold/30 object-cover"
                        />
                        <span className="absolute bottom-2 left-2 rounded-full border border-gold/25 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/85">
                          Featured
                        </span>
                        <button
                          type="button"
                          className="absolute -right-2 -top-2 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs glass-panel opacity-0 transition-opacity group-hover/featured:opacity-100 hover:bg-red-500/40"
                          onClick={() =>
                            setDraft({
                              ...current,
                              featuredImage: "",
                            })
                          }
                        >
                          x
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-6 text-sm text-muted-foreground">
                        No featured image set. Upload one to display it next to the Coat of Arms on all pages.
                      </div>
                    )}
                  </div>

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
                    token={token}
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

              {isNianiSection && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminInstitutionsEditor
                    institutions={current.institutions ?? []}
                    onChange={(institutions) => setDraft({ ...current, institutions })}
                    token={token}
                  />
                </>
              )}

              {isNianiSection && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <AdminArchitecturalProjectsEditor
                    projects={current.architecturalProjects ?? []}
                    onChange={(architecturalProjects) => setDraft({ ...current, architecturalProjects })}
                    token={token}
                  />
                </>
              )}

              {isNianiSection && (
                <>
                  <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5">
                    <Label className="flex items-center gap-2 text-sm font-medium text-foreground/90 mb-4">
                      <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                      Niani TV Videos
                    </Label>
                    <p className="text-xs text-muted-foreground mb-4">
                      Upload videos for the Niani TV page. These will be displayed in a grid on the public Niani TV page.
                    </p>
                    <MediaEditor
                      media={(current.media ?? []).filter((m) => m.type === "video")}
                      onChange={(videos) => setDraft({ ...current, media: [...(current.media ?? []).filter((m) => m.type !== "video"), ...videos] })}
                      token={token}
                    />
                  </div>
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
            </Card>
          </motion.div>
            )}

            {/* Content Editing Section */}
            {activeTab === "content" && currentContent && (
              <motion.div
                key={currentContent._id}
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
                        {getContentIcon(currentContent.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-bold gold-gradient-text">
                            {localize(currentContent.title) || currentContent.slug}
                          </h2>
                          {contentDraft && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Unsaved
                            </span>
                          )}
                          {!currentContent.isPublished && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground">/content/{currentContent.slug}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => void saveContent()}
                      disabled={updateContent.isPending}
                      className="gold-gradient-bg text-black font-bold px-6 shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all duration-300 hover:scale-105"
                    >
                      {updateContent.isPending ? (
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

                  <div className="space-y-6 rounded-[1.6rem] border border-gold/18 bg-[linear-gradient(155deg,rgba(255,205,86,0.08),rgba(0,0,0,0.15))] shadow-[0_22px_70px_rgba(0,0,0,0.14)] p-5 sm:p-6">
                    <div className="flex flex-col gap-3 rounded-[1.2rem] border border-gold/12 bg-black/25 p-4 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-display text-base font-semibold text-foreground">Custom Content</p>
                        <p className="mt-1 max-w-2xl leading-6">Create and manage additional content pages like Religion, Civilization, etc.</p>
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="group">
                      <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                        URL Slug
                      </Label>
                      <Input
                        value={currentContent.slug}
                        disabled
                        className="glass-panel border-gold/20 bg-black/20 opacity-60"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">The URL slug cannot be changed after creation</p>
                    </div>

                    {/* Title */}
                    <div className="group">
                      <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                        Title
                      </Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">English</span>
                          <Input
                            className="glass-panel border-gold/20 bg-black/20 transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                            placeholder="English title..."
                            value={currentContent.title?.en ?? ""}
                            onChange={(e) =>
                              setContentDraft({ ...currentContent, title: { ...(currentContent.title ?? {}), en: e.target.value } })
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">Français</span>
                          <Input
                            className="glass-panel border-gold/20 bg-black/20 transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                            placeholder="Titre en français..."
                            value={currentContent.title?.fr ?? ""}
                            onChange={(e) =>
                              setContentDraft({ ...currentContent, title: { ...(currentContent.title ?? {}), fr: e.target.value } })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="group">
                      <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                        Icon
                      </Label>
                      <select
                        value={currentContent.icon}
                        onChange={(e) => setContentDraft({ ...currentContent, icon: e.target.value })}
                        className="w-full rounded-md glass-panel border-gold/20 bg-black/20 px-3 py-2 text-sm"
                      >
                        <option value="FileText">FileText (Document)</option>
                        <option value="LayoutDashboard">LayoutDashboard (Dashboard)</option>
                        <option value="Clock">Clock (History)</option>
                        <option value="Crown">Crown (Governance)</option>
                        <option value="DollarSign">DollarSign (Economy)</option>
                        <option value="Building2">Building2 (Commerce)</option>
                        <option value="Users">Users (Culture)</option>
                        <option value="BookOpen">BookOpen (Resources)</option>
                        <option value="Globe">Globe (Global)</option>
                        <option value="FolderOpen">FolderOpen (Content)</option>
                        <option value="Layers">Layers (Multiple)</option>
                      </select>
                    </div>

                    {/* Published Status */}
                    <div className="group">
                      <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                        Visibility
                      </Label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setContentDraft({ ...currentContent, isPublished: !currentContent.isPublished })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            currentContent.isPublished ? "bg-gold" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              currentContent.isPublished ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-sm text-muted-foreground">
                          {currentContent.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="group">
                      <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                        Content
                      </Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">English</span>
                          <Textarea
                            className="min-h-48 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                            placeholder="English content..."
                            value={currentContent.content?.en ?? ""}
                            onChange={(e) =>
                              setContentDraft({ ...currentContent, content: { ...(currentContent.content ?? {}), en: e.target.value } })
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">Français</span>
                          <Textarea
                            className="min-h-48 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed transition-all duration-300 focus:border-gold/50 focus:ring-gold/20"
                            placeholder="Contenu en français..."
                            value={currentContent.content?.fr ?? ""}
                            onChange={(e) =>
                              setContentDraft({ ...currentContent, content: { ...(currentContent.content ?? {}), fr: e.target.value } })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="group">
                      <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/90">
                        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50"></span>
                        Images
                      </Label>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-xs text-muted-foreground">Upload images for this content page</p>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          className="w-auto glass-panel border-gold/20 text-xs"
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            if (files.length > 0) void onUploadContentImages(files);
                            e.currentTarget.value = "";
                          }}
                        />
                      </div>
                      {(currentContent.images ?? []).length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          {(currentContent.images ?? []).map((url, index) => (
                            <div key={url} className="relative group/image">
                              <img
                                src={url}
                                alt=""
                                className="h-24 w-full rounded-lg border border-gold/20 object-cover transition-all group-hover/image:border-gold/40"
                              />
                              <button
                                type="button"
                                className="absolute -right-2 -top-2 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs glass-panel opacity-0 transition-opacity group-hover/image:opacity-100 hover:bg-red-500/40"
                                onClick={() =>
                                  setContentDraft({
                                    ...currentContent,
                                    images: (currentContent.images ?? []).filter((_, imageIndex) => imageIndex !== index),
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
                          No images uploaded yet.
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="group">
                      <Separator className="my-6 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                      <AdminLinksEditor
                        links={currentContent.links ?? []}
                        onChange={(links) => setContentDraft({ ...currentContent, links })}
                        title="Links"
                        description="Add related links and resources for this content page"
                        addLabel="Add Link"
                        emptyMessage="No links yet. Click Add Link to create one."
                        itemLabel="Link"
                        urlFieldLabel="URL"
                        labelFieldLabel="Label"
                        urlPlaceholder="https://example.com"
                        labelPlaceholder="e.g. Wikipedia article"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Empty Content State */}
            {activeTab === "content" && !currentContent && !isCreatingContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-panel p-6 sm:p-8 border-gold/20 bg-gradient-to-b from-gold/5 to-transparent backdrop-blur-xl min-h-[400px] flex items-center justify-center">
                  {contentQuery.isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center animate-pulse">
                        <FolderOpen className="w-6 h-6 text-black" />
                      </div>
                      <span className="text-muted-foreground flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading content...
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-gold/60" />
                      </div>
                      <p className="text-muted-foreground mb-4">No custom content items yet.</p>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatingContent(true)}
                        className="border-gold/30 hover:bg-gold/10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create your first content item
                      </Button>
                    </div>
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

