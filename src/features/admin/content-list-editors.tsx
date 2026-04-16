import type { PageLink, TimelineItem, EconomyData, EconomyTable, EconomyTableRow } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Link2, Clock, DollarSign, Table, Landmark, ArrowRightLeft, FileCheck, Users, Upload, X } from "lucide-react";
import { uploadFile } from "@/api/upload";
import { toast } from "sonner";

const emptyLink = (): PageLink => ({
  label: { en: "" },
  url: "",
});

const emptyTimelineItem = (): TimelineItem => ({
  year: "",
  title: { en: "", fr: "" },
  description: { en: "", fr: "" },
  notes: { en: "", fr: "" },
  image: "",
  images: [],
  content: { en: "", fr: "" },
  url: "",
});

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type LinksEditorProps = {
  links: PageLink[];
  onChange: (links: PageLink[]) => void;
  showDonationHint?: boolean;
  title?: string;
  description?: string;
  addLabel?: string;
  emptyMessage?: string;
  itemLabel?: string;
  urlFieldLabel?: string;
  labelFieldLabel?: string;
  urlPlaceholder?: string;
  labelPlaceholder?: string;
};

export function AdminLinksEditor({
  links,
  onChange,
  showDonationHint,
  title = "External Links",
  description = "Add buttons or references (resources, donations, partners). Each link has a label and a full URL. Labels auto-translate on public site.",
  addLabel = "Add Link",
  emptyMessage = "No links yet. Click Add Link to create one.",
  itemLabel = "Link",
  urlFieldLabel = "URL",
  labelFieldLabel = "Label",
  urlPlaceholder = "https://example.com",
  labelPlaceholder = "e.g. Donate",
}: LinksEditorProps) {
  const list = links.length ? links : [];

  function setAt(i: number, next: PageLink) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-gold/5 to-transparent border border-gold/10">
        <div>
          <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
            <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center">
              <Link2 className="h-4 w-4 text-black" aria-hidden />
            </div>
            {title}
          </Label>
          <p className="mt-2 text-xs text-muted-foreground max-w-xl">
            {description}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
          onClick={() => onChange([...list, emptyLink()])}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center">
          <Link2 className="h-8 w-8 text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((link, i) => (
            <li
              key={i}
              className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/5 p-5 shadow-lg"
            >
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-gold via-gold/60 to-gold/20" aria-hidden />
              <div className="pl-3 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pl-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-gold">
                      {itemLabel} {i + 1}
                    </span>
                    {showDonationHint && i === 0 && (
                      <span className="text-[10px] px-2 py-0.5 bg-gold/20 text-gold rounded-full border border-gold/30">
                        Donate Button
                      </span>
                    )}
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
                      aria-label="Remove link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pl-3">
                  <Label htmlFor={`link-url-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    {urlFieldLabel}
                  </Label>
                  <Input
                    id={`link-url-${i}`}
                    type="url"
                    placeholder={urlPlaceholder}
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                    value={link.url ?? ""}
                    onChange={(e) =>
                      setAt(i, { ...link, url: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 pl-3">
                  <Label htmlFor={`link-en-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                    {labelFieldLabel}
                  </Label>
                  <Input
                    id={`link-en-${i}`}
                    placeholder={labelPlaceholder}
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                    value={link.label?.en ?? ""}
                    onChange={(e) =>
                      setAt(i, {
                        ...link,
                        label: { ...(link.label ?? {}), en: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type TimelineEditorProps = {
  timeline: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
  token: string;
};

export function AdminTimelineEditor({ timeline, onChange, token }: TimelineEditorProps) {
  const list = timeline.length ? timeline : [];
  const eventsWithYears = list.filter((item) => Boolean(item.year?.trim())).length;
  const eventsWithDescriptions = list.filter((item) => Boolean(item.description?.en?.trim() || item.description?.fr?.trim())).length;
  const eventsWithNotes = list.filter((item) => Boolean(item.notes?.en?.trim() || item.notes?.fr?.trim())).length;

  function setAt(i: number, next: TimelineItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
  }

  async function handleImageUpload(file: File, index: number) {
    try {
      const res = await uploadFile(file, token);
      setAt(index, { ...list[index], image: res.media.url });
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    }
  }

  async function handleAdditionalImageUpload(file: File, index: number) {
    try {
      const res = await uploadFile(file, token);
      const currentImages = list[index].images || [];
      setAt(index, { ...list[index], images: [...currentImages, res.media.url] });
      toast.success("Image added to gallery");
    } catch {
      toast.error("Upload failed");
    }
  }

  function removeAdditionalImage(index: number, imageIndex: number) {
    const currentImages = list[index].images || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    setAt(index, { ...list[index], images: newImages });
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-[linear-gradient(140deg,rgba(255,205,86,0.08),rgba(255,205,86,0.02))] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <div className="flex flex-wrap items-end justify-between gap-3 p-5">
          <div>
            <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient-bg shadow-lg shadow-gold/20">
                <Clock className="h-4 w-4 text-black" aria-hidden />
              </div>
              History Timeline
            </Label>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">
              Every event here appears on the public History page in this exact order. Keep the wording clean, factual, and easy to scan.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
            onClick={() => onChange([...list, emptyTimelineItem()])}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-px border-t border-gold/10 bg-gold/10 md:grid-cols-3">
          {[
            {
              label: "Total events",
              value: list.length,
              note: "Ordered entries shown publicly",
            },
            {
              label: "Dated items",
              value: eventsWithYears,
              note: "Events with a year or era filled in",
            },
            {
              label: "Detailed items",
              value: eventsWithDescriptions,
              note: "Events with supporting descriptions",
            },
            {
              label: "Events with notes",
              value: eventsWithNotes,
              note: "Events with editorial or contextual notes",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-black/25 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">{stat.label}</p>
              <p className="mt-3 text-3xl font-display font-semibold text-foreground">{String(stat.value).padStart(2, "0")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-gold/20 bg-gradient-to-b from-gold/5 to-transparent px-6 py-12 text-center">
          <Clock className="h-8 w-8 text-gold/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No timeline events yet. Click <span className="text-gold font-semibold">Add Event</span> to start building the public chronology.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs leading-5 text-muted-foreground">
            Scroll inside this panel to move through long timelines without losing your place in the rest of the editor.
          </p>
          <div className="rounded-[1.5rem] border border-gold/12 bg-black/15 p-3">
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain pr-2">
              <ul className="space-y-4">
                {list.map((item, i) => (
                  <li
                    key={i}
                    className="relative overflow-hidden rounded-[1.65rem] border border-gold/15 bg-[linear-gradient(150deg,rgba(255,205,86,0.07),rgba(0,0,0,0.2))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.14)]"
                  >
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-gold via-gold/60 to-gold/20" aria-hidden />
                    <div className="pl-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-display font-bold uppercase tracking-[0.3em] text-gold">
                            Timeline Event {String(i + 1).padStart(2, "0")}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-gold/20 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/80">
                              {item.year?.trim() || "No year yet"}
                            </span>
                            {item.title?.en?.trim() || item.title?.fr?.trim() ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-foreground/75">
                                {item.title?.en?.trim() || item.title?.fr?.trim()}
                              </span>
                            ) : null}
                          </div>
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
                            aria-label="Remove event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                        <div className="space-y-2">
                          <Label htmlFor={`tl-year-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                            Year / Era
                          </Label>
                          <Input
                            id={`tl-year-${i}`}
                            placeholder="e.g. 1236 A.D."
                            className="border-gold/20 bg-black/20 font-display tracking-wide focus:border-gold/50 focus:ring-gold/20"
                            value={item.year ?? ""}
                            onChange={(e) => setAt(i, { ...item, year: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`tl-title-en-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                            Title (EN)
                          </Label>
                          <Input
                            id={`tl-title-en-${i}`}
                            placeholder="Event title..."
                            className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                            value={item.title?.en ?? ""}
                            onChange={(e) =>
                              setAt(i, {
                                ...item,
                                title: { ...(item.title ?? {}), en: e.target.value },
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`tl-title-fr-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"></span>
                            Titre (FR)
                          </Label>
                          <Input
                            id={`tl-title-fr-${i}`}
                            placeholder="Titre de l'événement..."
                            className="border-blue-400/20 bg-black/20 focus:border-blue-400/50 focus:ring-blue-400/20"
                            value={item.title?.fr ?? ""}
                            onChange={(e) =>
                              setAt(i, {
                                ...item,
                                title: { ...(item.title ?? {}), fr: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`tl-desc-en-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                            Description EN <span className="text-muted-foreground font-normal">(optional)</span>
                          </Label>
                          <Textarea
                            id={`tl-desc-en-${i}`}
                            rows={3}
                            placeholder="Enter event description..."
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
                          <Label htmlFor={`tl-desc-fr-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"></span>
                            Description FR <span className="text-muted-foreground font-normal">(optionnel)</span>
                          </Label>
                          <Textarea
                            id={`tl-desc-fr-${i}`}
                            rows={3}
                            placeholder="Entrez la description..."
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

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`tl-notes-en-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                            Notes EN <span className="text-muted-foreground font-normal">(optional)</span>
                          </Label>
                          <Textarea
                            id={`tl-notes-en-${i}`}
                            rows={3}
                            placeholder="Add contextual notes..."
                            className="min-h-[4.5rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                            value={item.notes?.en ?? ""}
                            onChange={(e) =>
                              setAt(i, {
                                ...item,
                                notes: { ...(item.notes ?? {}), en: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`tl-notes-fr-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"></span>
                            Notes FR <span className="text-muted-foreground font-normal">(optionnel)</span>
                          </Label>
                          <Textarea
                            id={`tl-notes-fr-${i}`}
                            rows={3}
                            placeholder="Ajoutez des notes..."
                            className="min-h-[4.5rem] border-blue-400/20 bg-black/20 resize-y focus:border-blue-400/50 focus:ring-blue-400/20"
                            value={item.notes?.fr ?? ""}
                            onChange={(e) =>
                              setAt(i, {
                                ...item,
                                notes: { ...(item.notes ?? {}), fr: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`tl-image-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                          Event image <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        {item.image ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-gold/20 bg-black/20">
                              <img src={item.image} alt={item.title?.en || "Timeline event image"} className="w-20 h-14 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gold truncate">{item.image}</p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="shrink-0 border-gold/30 hover:bg-gold/10"
                                onClick={() => setAt(i, { ...item, image: "" })}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              className="flex-1 border-gold/20 bg-black/20 text-xs"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, i);
                                }
                                e.currentTarget.value = "";
                              }}
                            />
                            <Input
                              placeholder="Or paste image URL..."
                              className="flex-1 border-gold/20 bg-black/20 text-xs"
                              value={item.image ?? ""}
                              onChange={(e) => setAt(i, { ...item, image: e.target.value })}
                            />
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                          Upload an image or paste a URL. This image will appear on the timeline event detail page.
                        </p>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`tl-images-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                          Additional images <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            className="flex-1 border-gold/20 bg-black/20 text-xs"
                            onChange={(e) => {
                              const files = Array.from(e.target.files ?? []);
                              files.forEach(file => handleAdditionalImageUpload(file, i));
                              e.currentTarget.value = "";
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-gold/30 hover:bg-gold/10"
                            onClick={() => setAt(i, { ...item, images: [] })}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Upload multiple images to display in a gallery on the timeline event detail page.
                        </p>
                      </div>

                      {(item.images && item.images.length > 0) ? (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">Image Gallery Preview ({item.images.length})</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {item.images.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img src={img} alt={`${item.title?.en || "Timeline event"} ${idx + 1}`} className="h-32 w-full rounded-[1rem] object-cover" />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeAdditionalImage(i, idx)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`tl-content-en-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                          Full content <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Textarea
                          id={`tl-content-en-${i}`}
                          rows={6}
                          placeholder="Enter detailed content for this timeline event (full article body)..."
                          className="min-h-[9rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                          value={item.content?.en ?? ""}
                          onChange={(e) =>
                            setAt(i, {
                              ...item,
                              content: { ...(item.content ?? {}), en: e.target.value },
                            })
                          }
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Add full article-like content. This will be displayed in the overview section of the timeline event detail page.
                        </p>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`tl-url-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                          Link URL <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                          id={`tl-url-${i}`}
                          type="url"
                          placeholder="e.g., /history/timeline/arrival-of-mandenkas or https://example.com"
                          className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                          value={item.url ?? ""}
                          onChange={(e) => setAt(i, { ...item, url: e.target.value })}
                        />
                        <p className="text-[11px] text-muted-foreground">
                          When set, clicking this event on the History page will navigate to this URL. Leave it blank to use the default internal timeline page.
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Economy Table Editor
const emptyTableRow = (): EconomyTableRow => ({
  label: { en: "" },
  value: { en: "" },
  description: { en: "" },
});

const emptyTable = (): EconomyTable => ({
  title: { en: "" },
  description: { en: "" },
  rows: [],
});

const emptyEconomyData = (): EconomyData => ({
  currencyInfo: { en: "" },
  bankInfo: { en: "" },
  transferServices: emptyTable(),
  recommendationLetters: emptyTable(),
  duesSystem: emptyTable(),
});

type EconomyEditorProps = {
  economy: EconomyData | undefined;
  onChange: (economy: EconomyData) => void;
};

function TableEditor({
  table,
  onChange,
  title,
  icon: Icon,
}: {
  table: EconomyTable | undefined;
  onChange: (table: EconomyTable) => void;
  title: string;
  icon: React.ElementType;
}) {
  const current = table ?? emptyTable();
  const rows = current.rows ?? [];

  function setRowAt(i: number, next: EconomyTableRow) {
    const newRows = [...rows];
    newRows[i] = next;
    onChange({ ...current, rows: newRows });
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-gold/15 bg-black/20">
      <div className="p-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gold-gradient-bg flex items-center justify-center">
            <Icon className="h-4 w-4 text-black" />
          </div>
          <Label className="text-sm font-semibold text-foreground">{title}</Label>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Table Title</Label>
          <Input
            placeholder="e.g., Money Transfer Services"
            className="border-gold/20 bg-black/20"
            value={current.title?.en ?? ""}
            onChange={(e) => onChange({ ...current, title: { en: e.target.value } })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Input
            placeholder="Brief description of this table..."
            className="border-gold/20 bg-black/20"
            value={current.description?.en ?? ""}
            onChange={(e) => onChange({ ...current, description: { en: e.target.value } })}
          />
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gold/20 bg-gold/5 p-4 text-center">
            <p className="text-sm text-muted-foreground">No rows yet. Click Add Row to create one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div
                key={i}
                className="rounded-xl border border-gold/15 bg-gold/5 p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gold">Row {i + 1}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive/80 hover:text-destructive"
                    onClick={() => onChange({ ...current, rows: rows.filter((_, j) => j !== i) })}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Input
                    placeholder="Label (e.g., Domestic Transfers)"
                    className="border-gold/20 bg-black/20 text-sm"
                    value={row.label?.en ?? ""}
                    onChange={(e) => setRowAt(i, { ...row, label: { en: e.target.value } })}
                  />
                  <Input
                    placeholder="Value (e.g., 0.5% fee)"
                    className="border-gold/20 bg-black/20 text-sm"
                    value={row.value?.en ?? ""}
                    onChange={(e) => setRowAt(i, { ...row, value: { en: e.target.value } })}
                  />
                  <Input
                    placeholder="Description (optional)"
                    className="border-gold/20 bg-black/20 text-sm"
                    value={row.description?.en ?? ""}
                    onChange={(e) => setRowAt(i, { ...row, description: { en: e.target.value } })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full border-gold/20 hover:bg-gold/10"
          onClick={() => onChange({ ...current, rows: [...rows, emptyTableRow()] })}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Row
        </Button>
      </div>
    </div>
  );
}

export function AdminEconomyEditor({ economy, onChange }: EconomyEditorProps) {
  const current = economy ?? emptyEconomyData();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-[linear-gradient(140deg,rgba(255,205,86,0.08),rgba(255,205,86,0.02))] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <div className="flex flex-wrap items-end justify-between gap-3 p-5">
          <div>
            <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient-bg shadow-lg shadow-gold/20">
                <DollarSign className="h-4 w-4 text-black" aria-hidden />
              </div>
              Economy Data
            </Label>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">
              Configure financial tables for transfer services, recommendation letters, and membership dues.
            </p>
          </div>
        </div>
      </div>

      {/* General Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <Landmark className="h-4 w-4 text-gold" />
            Currency Information
          </Label>
          <Textarea
            placeholder="Describe the currency system..."
            className="min-h-[80px] border-gold/20 bg-black/20"
            value={current.currencyInfo?.en ?? ""}
            onChange={(e) => onChange({ ...current, currencyInfo: { en: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <Table className="h-4 w-4 text-gold" />
            Banking Information
          </Label>
          <Textarea
            placeholder="Bank details, SWIFT codes, etc."
            className="min-h-[80px] border-gold/20 bg-black/20"
            value={current.bankInfo?.en ?? ""}
            onChange={(e) => onChange({ ...current, bankInfo: { en: e.target.value } })}
          />
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TableEditor
          table={current.transferServices}
          onChange={(transferServices) => onChange({ ...current, transferServices })}
          title="Transfer Services"
          icon={ArrowRightLeft}
        />
        <TableEditor
          table={current.recommendationLetters}
          onChange={(recommendationLetters) => onChange({ ...current, recommendationLetters })}
          title="Recommendation Letters"
          icon={FileCheck}
        />
      </div>

      <TableEditor
        table={current.duesSystem}
        onChange={(duesSystem) => onChange({ ...current, duesSystem })}
        title="Dues System"
        icon={Users}
      />
    </div>
  );
}
