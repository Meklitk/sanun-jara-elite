import type { ArchitecturalProjectItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Building2, X, Upload } from "lucide-react";
import { uploadFile } from "@/api/upload";
import { toast } from "sonner";

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type ArchitecturalProjectsEditorProps = {
  projects: ArchitecturalProjectItem[];
  onChange: (items: ArchitecturalProjectItem[]) => void;
  token: string;
};

export function AdminArchitecturalProjectsEditor({ projects, onChange, token }: ArchitecturalProjectsEditorProps) {
  const list = projects.length ? projects : [];

  function setAt(i: number, next: ArchitecturalProjectItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  async function handleConceptImageUpload(file: File, index: number) {
    try {
      const res = await uploadFile(file, token);
      const currentImages = list[index].conceptImages || [];
      setAt(index, { ...list[index], conceptImages: [...currentImages, res.media.url] });
      toast.success("Concept image added");
    } catch {
      toast.error("Upload failed");
    }
  }

  async function handleWorkImageUpload(file: File, index: number) {
    try {
      const res = await uploadFile(file, token);
      const currentImages = list[index].workImages || [];
      setAt(index, { ...list[index], workImages: [...currentImages, res.media.url] });
      toast.success("Work image added");
    } catch {
      toast.error("Upload failed");
    }
  }

  function removeConceptImage(index: number, imageIndex: number) {
    const currentImages = list[index].conceptImages || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    setAt(index, { ...list[index], conceptImages: newImages });
  }

  function removeWorkImage(index: number, imageIndex: number) {
    const currentImages = list[index].workImages || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    setAt(index, { ...list[index], workImages: newImages });
  }

  const emptyProject = (): ArchitecturalProjectItem => ({
    id: Date.now().toString(),
    name: { en: "", fr: "" },
    description: { en: "", fr: "" },
    conceptImages: [],
    workImages: [],
  });

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-[linear-gradient(140deg,rgba(255,205,86,0.08),rgba(255,205,86,0.02))] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <div className="flex flex-wrap items-end justify-between gap-3 p-5">
          <div>
            <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient-bg shadow-lg shadow-gold/20">
                <Building2 className="h-4 w-4 text-black" aria-hidden />
              </div>
              Architectural Projects
            </Label>
            <p className="mt-2 text-xs text-muted-foreground max-w-xl">
              Add architectural projects with conceptual images and work pictures for the Niani page.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
            onClick={() => onChange([...list, emptyProject()])}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center">
          <Building2 className="h-8 w-8 text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No projects yet. Click <span className="text-gold font-semibold">Add Project</span> to add one.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((item, i) => (
            <li
              key={item.id}
              className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/5 p-5 shadow-lg"
            >
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-gold via-gold/60 to-gold/20" aria-hidden />
              <div className="pl-3 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pl-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-gold">
                      Project {i + 1}
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
                      aria-label="Remove project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 pl-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                      Name (EN)
                    </Label>
                    <Input
                      placeholder="Project name..."
                      className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                      value={item.name?.en ?? ""}
                      onChange={(e) =>
                        setAt(i, {
                          ...item,
                          name: { ...(item.name ?? {}), en: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"></span>
                      Nom (FR)
                    </Label>
                    <Input
                      placeholder="Nom du projet..."
                      className="border-blue-400/20 bg-black/20 focus:border-blue-400/50 focus:ring-blue-400/20"
                      value={item.name?.fr ?? ""}
                      onChange={(e) =>
                        setAt(i, {
                          ...item,
                          name: { ...(item.name ?? {}), fr: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 pl-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                      Description EN
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder="Describe the project..."
                      className="min-h-[4.5rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                      value={item.description?.en ?? ""}
                      onChange={(e) =>
                        setAt(i, {
                          ...item,
                          description: { ...(item.description ?? {}), en: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"></span>
                      Description FR
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder="Décrivez le projet..."
                      className="min-h-[4.5rem] border-blue-400/20 bg-black/20 resize-y focus:border-blue-400/50 focus:ring-blue-400/20"
                      value={item.description?.fr ?? ""}
                      onChange={(e) =>
                        setAt(i, {
                          ...item,
                          description: { ...(item.description ?? {}), fr: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 pl-3">
                  <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    Concept Images
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="flex-1 border-gold/20 bg-black/20 text-xs"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        files.forEach(file => handleConceptImageUpload(file, i));
                        e.currentTarget.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="shrink-0 border-gold/30 hover:bg-gold/10"
                      onClick={() => setAt(i, { ...item, conceptImages: [] })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {item.conceptImages && item.conceptImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {item.conceptImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`${item.name?.en || item.name?.fr || "Project"} concept ${idx + 1}`} className="h-24 w-full rounded-lg object-cover" />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeConceptImage(i, idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pl-3">
                  <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    Work Images <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="flex-1 border-gold/20 bg-black/20 text-xs"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        files.forEach(file => handleWorkImageUpload(file, i));
                        e.currentTarget.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="shrink-0 border-gold/30 hover:bg-gold/10"
                      onClick={() => setAt(i, { ...item, workImages: [] })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {item.workImages && item.workImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {item.workImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`${item.name?.en || item.name?.fr || "Project"} work ${idx + 1}`} className="h-24 w-full rounded-lg object-cover" />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeWorkImage(i, idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
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
