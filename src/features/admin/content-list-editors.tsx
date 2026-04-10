import type { PageLink, TimelineItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown, Link2, Clock } from "lucide-react";

const emptyLink = (): PageLink => ({
  label: { en: "" },
  url: "",
});

const emptyTimelineItem = (): TimelineItem => ({
  year: "",
  title: { en: "" },
  description: { en: "" },
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
};

export function AdminTimelineEditor({ timeline, onChange }: TimelineEditorProps) {
  const list = timeline.length ? timeline : [];
  const eventsWithYears = list.filter((item) => Boolean(item.year?.trim())).length;
  const eventsWithDescriptions = list.filter((item) => Boolean(item.description?.en?.trim())).length;

  function setAt(i: number, next: TimelineItem) {
    const copy = [...list];
    copy[i] = next;
    onChange(copy);
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
                            {item.title?.en?.trim() ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-foreground/75">
                                {item.title.en.trim()}
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
                            Title
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
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`tl-desc-en-${i}`} className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gold/60 rounded-full"></span>
                          Description <span className="text-muted-foreground font-normal">(optional)</span>
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
