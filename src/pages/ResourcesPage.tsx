import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { usePages } from "@/api/pages";
import { BookOpen, BarChart3, Building2, FileText, Eye, Download, X } from "lucide-react";
import { useState } from "react";
import type { MediaItem } from "@/api/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function PDFCard({ pdf, index }: { pdf: MediaItem; index: number }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="glass-panel rounded-xl overflow-hidden hover:border-gold/40 transition-all duration-300 group"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground/90 text-lg mb-1 line-clamp-2">
                {pdf.title || "Untitled Document"}
              </h3>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {pdf.url.split("/").pop()}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium transition-all duration-300 border border-gold/20 hover:border-gold/40"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-amber-500 hover:from-amber-400 hover:to-gold text-black text-sm font-semibold transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/40"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      </motion.div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border-gold/30">
          <DialogHeader className="p-4 border-b border-gold/20 flex flex-row items-center justify-between">
            <DialogTitle className="font-display text-gold text-lg">
              {pdf.title || "Document Preview"}
            </DialogTitle>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="flex-1 h-[calc(90vh-80px)]">
            <iframe
              src={pdf.url}
              className="w-full h-full border-0"
              title={pdf.title || "PDF Preview"}
            />
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
  const pdfs = resourcesPage?.media?.filter((m) => m.type === "document") ?? [];

  const sections = [
    { icon: BookOpen, title: t.organizationalRubric, desc: t.organizationalRubricDesc },
    { icon: BarChart3, title: t.statistics, desc: t.statisticsDesc },
    { icon: Building2, title: t.mandenOrganizations, desc: t.mandenOrganizationsDesc },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-display font-bold gold-gradient-text mb-4">
          {localize(resourcesPage?.title) || t.resources}
        </h1>
        <p className="text-lg text-foreground/80 font-body max-w-2xl mx-auto">
          {localize(resourcesPage?.content) || "Access important documents, statistics, and organizational information."}
        </p>
      </motion.div>

      {/* Resource Category Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center hover:bg-muted/30 transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <sec.icon className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-lg text-gold mb-3">{sec.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{sec.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* PDF Documents Section */}
      {pdfs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground/90">Documents</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-gold/20 text-gold rounded-full">
              {pdfs.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pdfs.map((pdf, index) => (
              <PDFCard key={index} pdf={pdf} index={index} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel gold-border-glow rounded-xl p-8 mb-8"
      >
        <h2 className="font-display text-xl text-gold mb-6">{t.sources}</h2>
        <ol className="space-y-3 font-body text-foreground/80 list-decimal list-inside">
          <li>wikipedia.org/manden_empire</li>
          <li>wikipedia.org/sanun_jara (En création)</li>
          <li>Le Djeliba</li>
        </ol>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel gold-border-glow rounded-xl p-8"
      >
        <h2 className="font-display text-xl text-gold mb-4">{t.phone}</h2>
        <p className="font-body text-foreground/90 text-lg">1 (800) 636-5913</p>
      </motion.div>
    </div>
  );
}
