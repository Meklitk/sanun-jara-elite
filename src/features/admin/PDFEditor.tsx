import type { MediaItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, FileText, Eye } from "lucide-react";
import { uploadFile } from "@/api/upload";
import { toast } from "sonner";

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type PDFEditorProps = {
  pdfs: MediaItem[];
  onChange: (pdfs: MediaItem[]) => void;
  token: string;
};

export function PDFEditor({ pdfs, onChange, token }: PDFEditorProps) {
  const list = pdfs.length ? pdfs : [];

  function setAt(i: number, next: MediaItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  async function handleFileUpload(file: File, index: number) {
    if (!file.type.includes("pdf")) {
      toast.error("Only PDF files are allowed");
      return;
    }
    try {
      const res = await uploadFile(file, token);
      setAt(index, { ...list[index], url: res.media.url });
      toast.success("PDF uploaded");
    } catch {
      toast.error("Upload failed");
    }
  }

  const emptyPDF = (): MediaItem => ({
    url: "",
    title: "",
    type: "document",
    category: "other",
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-gold/5 to-transparent border border-gold/10">
        <div>
          <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
            <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center">
              <FileText className="h-4 w-4 text-black" aria-hidden />
            </div>
            PDF Resources
          </Label>
          <p className="mt-2 text-xs text-muted-foreground max-w-xl">
            Upload PDF documents for the Resources page. Add organizational rubrics, statistics, and organization lists.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
          onClick={() => onChange([...list, emptyPDF()])}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add PDF
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center">
          <FileText className="h-8 w-8 text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No PDFs yet. Click <span className="text-gold font-semibold">Add PDF</span> to upload documents.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((item, i) => (
            <li
              key={i}
              className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/5 p-5 shadow-lg"
            >
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-gold via-gold/60 to-gold/20" aria-hidden />
              <div className="pl-3 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pl-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-gold">
                      PDF {i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-gold"
                      disabled={i === 0}
                      onClick={() => onChange(moveItem(list, i, i - 1))}
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-gold"
                      disabled={i === list.length - 1}
                      onClick={() => onChange(moveItem(list, i, i + 1))}
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onChange(list.filter((_, j) => j !== i))}
                      aria-label="Remove PDF"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pl-3">
                  <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    Document Title
                  </Label>
                  <Input
                    placeholder="e.g. Organizational Rubric"
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                    value={item.title}
                    onChange={(e) => setAt(i, { ...item, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2 pl-3">
                  <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    PDF File
                  </Label>
                  {item.url ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-gold/20">
                      <FileText className="w-8 h-8 text-red-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gold truncate">{item.url.split("/").pop()}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-gold/30 hover:bg-gold/10"
                        onClick={() => setAt(i, { ...item, url: "" })}
                      >
                        Change
                      </Button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-gold/30 hover:bg-gold/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".pdf"
                        className="flex-1 border-gold/20 bg-black/20 text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, i);
                          }
                          e.currentTarget.value = "";
                        }}
                      />
                      <Input
                        placeholder="Or paste PDF URL..."
                        className="flex-1 border-gold/20 bg-black/20 text-xs"
                        value={item.url}
                        onChange={(e) => setAt(i, { ...item, url: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
