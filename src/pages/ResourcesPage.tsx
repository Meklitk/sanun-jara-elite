import { motion } from "framer-motion";
import { useState } from "react";
import { usePages } from "@/api/pages";
import type { MediaItem, PageLink } from "@/api/types";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, ExternalLink, Eye, FileText, LibraryBig, Link2, X } from "lucide-react";

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ResourceLinkCard({
  link,
  index,
  localize,
}: {
  link: PageLink;
  index: number;
  localize: (value: { en?: string; fr?: string } | undefined) => string;
}) {
  const label = localize(link.label) || link.url || `Resource ${index + 1}`;
  const href = link.url?.trim();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="rounded-[1.6rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(255,205,86,0.06),rgba(0,0,0,0.2))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.14)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gold-gradient-bg shadow-lg shadow-gold/20">
          <Link2 className="h-5 w-5 text-black" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">External Resource</p>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{label}</h3>
          {href ? (
            <p className="mt-2 truncate text-xs text-muted-foreground">{href}</p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Link unavailable</p>
          )}
        </div>
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold/40 hover:bg-gold/15"
        >
          Open Resource
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
    </motion.article>
  );
}

function PDFCard({ pdf, index }: { pdf: MediaItem; index: number }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileName = pdf.url.split("/").pop() || "document.pdf";

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06 }}
        className="rounded-[1.6rem] border border-gold/15 bg-[linear-gradient(150deg,rgba(255,205,86,0.06),rgba(0,0,0,0.22))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.14)]"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/25 to-red-700/10">
            <FileText className="h-7 w-7 text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">PDF Document</p>
            <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
              {pdf.title || "Untitled Document"}
            </h3>
            <p className="mt-2 truncate text-xs text-muted-foreground">{fileName}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold/40 hover:bg-gold/15"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <a
            href={pdf.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full gold-gradient-bg px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          >
            <Download className="h-4 w-4" />
            Open PDF
          </a>
        </div>
      </motion.article>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="h-[90vh] w-[95vw] max-w-5xl border-gold/30 bg-black/95 p-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-gold/20 p-4">
            <DialogTitle className="font-display text-lg text-gold">
              {pdf.title || "Document Preview"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          <div className="h-[calc(90vh-80px)] flex-1">
            <iframe src={pdf.url} className="h-full w-full border-0" title={pdf.title || "PDF Preview"} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ResourcesPage() {
  const { t, localize } = useI18n();
  const pagesQuery = usePages();
  const resourcesPage = pagesQuery.data?.pages.find((p) => p.key === "resources");

  if (pagesQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="h-14 w-56 animate-pulse rounded-xl bg-muted/20" />
        <div className="mt-6 h-40 animate-pulse rounded-[2rem] bg-muted/20" />
      </div>
    );
  }

  if (pagesQuery.error || !resourcesPage) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        <Card className="glass-panel p-8 text-center">
          <p className="text-destructive">Failed to load resources.</p>
        </Card>
      </div>
    );
  }

  const paragraphs = splitParagraphs(
    localize(resourcesPage.content) || "Access important documents, external links, and related public resources."
  );
  const links = (resourcesPage.links ?? []).filter((link) => Boolean(link.url?.trim() || localize(link.label)));
  const pdfs = (resourcesPage.media ?? []).filter(
    (item) => Boolean(item.url?.trim()) && (item.type === "document" || item.url.toLowerCase().endsWith(".pdf"))
  );

  return (
    <div className="space-y-0">
      {/* HEADER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.92),rgba(40,24,6,0.82))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
            <div className="flex flex-col items-center text-center gap-8">
              <div className="space-y-5 max-w-3xl">
                <div className="inline-flex items-center justify-center rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">
                  Resources Directory
                </div>

                <h1 className="text-4xl font-display font-bold gold-gradient-text sm:text-5xl">
                  {localize(resourcesPage.title) || t.resources}
                </h1>

                <div className="space-y-6">
                  <p className="text-base leading-8 text-foreground/80 sm:text-lg">
                    Welcome to the <span className="text-gold font-semibold">Resources Hub</span>.
                    This section provides curated documents, research materials, and tools
                    designed to support informed decision-making and community engagement.
                  </p>

                  <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold/70 mb-4">
                      What you'll find
                    </p>

                    <ul className="grid gap-3 sm:grid-cols-2 text-left">
                      {[
                        "Organizational guides and frameworks",
                        "Key statistics and research summaries",
                        "Verified organizations and initiatives",
                        "Practical tools for planning and implementation",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 rounded-xl border border-gold/10 bg-black/30 p-3 hover:border-gold/30 hover:bg-black/50 transition"
                        >
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gold" />
                          <span className="text-sm text-foreground/85">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    All materials are regularly updated to ensure accuracy and relevance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* EXTERNAL LINKS - FULL WIDTH */}
      <section className="w-full border-t border-gold/10">
        <div className="px-4 py-10 max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">Links</p>
              <h2 className="mt-2 text-2xl font-display font-semibold text-foreground">External resources</h2>
            </div>
            <p className="text-sm text-muted-foreground">{links.length} link{links.length === 1 ? "" : "s"}</p>
          </div>

          {links.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {links.map((link, index) => (
                <ResourceLinkCard key={`${link.url}-${index}`} link={link} index={index} localize={localize} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center text-muted-foreground">
              No external resources added yet.
            </div>
          )}
        </div>
      </section>

      {/* PDFs - FULL WIDTH */}
      <section className="w-full border-t border-gold/10">
        <div className="px-4 py-10 max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">Documents</p>
              <h2 className="mt-2 text-2xl font-display font-semibold text-foreground">PDF library</h2>
            </div>
            <p className="text-sm text-muted-foreground">{pdfs.length} file{pdfs.length === 1 ? "" : "s"}</p>
          </div>

          {pdfs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pdfs.map((pdf, index) => (
                <PDFCard key={`${pdf.url}-${index}`} pdf={pdf} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center text-muted-foreground">
              No PDF documents uploaded yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
