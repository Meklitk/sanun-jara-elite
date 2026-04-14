import type { BiographyItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Plus, Trash2, User, Building2, ImagePlus } from "lucide-react";
import { uploadFile } from "@/api/upload";
import { toast } from "sonner";

function emptyBiography(): BiographyItem {
  return {
    slug: "",
    name: { en: "" },
    role: { en: "" },
    kind: "person",
    content: { en: "" },
    images: [],
    meta: [],
  };
}

function emptyMetaItem() {
  return {
    label: { en: "" },
    value: { en: "" },
  };
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
}

type Props = {
  biographies: BiographyItem[];
  onChange: (biographies: BiographyItem[]) => void;
  token: string;
};

export default function AdminBiographiesEditor({ biographies, onChange, token }: Props) {
  async function onUpload(index: number, files: File[]) {
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
      const updated = [...biographies];
      updated[index] = {
        ...updated[index],
        images: [...(updated[index].images ?? []), ...uploadedUrls],
      };
      onChange(updated);
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

  function updateBiography(index: number, next: BiographyItem) {
    const updated = [...biographies];
    updated[index] = next;
    onChange(updated);
  }

  function updateMeta(biographyIndex: number, metaIndex: number, key: "label" | "value", value: string) {
    const updated = [...biographies];
    const bio = updated[biographyIndex];
    const meta = [...(bio.meta ?? [])];
    meta[metaIndex] = {
      ...meta[metaIndex],
      [key]: { ...meta[metaIndex][key], en: value },
    };
    updated[biographyIndex] = { ...bio, meta };
    onChange(updated);
  }

  function addMeta(biographyIndex: number) {
    const updated = [...biographies];
    const bio = updated[biographyIndex];
    updated[biographyIndex] = {
      ...bio,
      meta: [...(bio.meta ?? []), emptyMetaItem()],
    };
    onChange(updated);
  }

  function removeMeta(biographyIndex: number, metaIndex: number) {
    const updated = [...biographies];
    const bio = updated[biographyIndex];
    updated[biographyIndex] = {
      ...bio,
      meta: (bio.meta ?? []).filter((_, i) => i !== metaIndex),
    };
    onChange(updated);
  }

  function removeImage(biographyIndex: number, imageIndex: number) {
    const updated = [...biographies];
    const bio = updated[biographyIndex];
    updated[biographyIndex] = {
      ...bio,
      images: (bio.images ?? []).filter((_, i) => i !== imageIndex),
    };
    onChange(updated);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Biographies",
            value: biographies.length,
            note: "People and institutions with custom content",
          },
          {
            label: "People",
            value: biographies.filter((b) => b.kind === "person").length,
            note: "Individual profiles with biography text",
          },
          {
            label: "Institutions",
            value: biographies.filter((b) => b.kind === "institution").length,
            note: "Organizations and structural entities",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.4rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(255,205,86,0.08),rgba(255,205,86,0.02))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.12)]"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">{item.label}</p>
            <p className="mt-3 text-3xl font-display font-semibold text-foreground">
              {String(item.value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Biography Pages</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Create detailed pages for people and institutions. Each biography needs a unique URL slug
              (e.g., "mari-djata-keita-v") that matches the URL set in the Governance editor.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30"
            onClick={() => onChange([...biographies, emptyBiography()])}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Biography
          </Button>
        </div>

        <div className="space-y-4">
          {biographies.map((bio, index) => (
            <div
              key={`${bio.slug || "new"}-${index}`}
              className="rounded-[1.35rem] border border-gold/12 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                    {bio.kind === "person" ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                  </div>
                  <p className="text-[11px] font-display font-bold uppercase tracking-[0.28em] text-gold">
                    {bio.name?.en || `Biography ${String(index + 1).padStart(2, "0")}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-gold"
                    disabled={index === 0}
                    onClick={() => onChange(moveItem(biographies, index, index - 1))}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-gold"
                    disabled={index === biographies.length - 1}
                    onClick={() => onChange(moveItem(biographies, index, index + 1))}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onChange(biographies.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <Input
                      value={bio.slug}
                      onChange={(e) =>
                        updateBiography(index, { ...bio, slug: e.target.value })
                      }
                      placeholder="mari-djata-keita-v"
                      className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Must match the URL in Governance editor (e.g., /governance/biographies/mari-djata-keita-v)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Name</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        value={bio.name?.en ?? ""}
                        onChange={(e) =>
                          updateBiography(index, {
                            ...bio,
                            name: { ...bio.name, en: e.target.value },
                            slug: bio.slug || slugify(e.target.value),
                          })
                        }
                        placeholder="English name"
                        className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                      />
                      <Input
                        value={bio.name?.fr ?? ""}
                        onChange={(e) =>
                          updateBiography(index, {
                            ...bio,
                            name: { ...bio.name, fr: e.target.value },
                          })
                        }
                        placeholder="Nom en français"
                        className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role / Title</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        value={bio.role?.en ?? ""}
                        onChange={(e) =>
                          updateBiography(index, {
                            ...bio,
                            role: { ...bio.role, en: e.target.value },
                          })
                        }
                        placeholder="e.g., Manden Mansa"
                        className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                      />
                      <Input
                        value={bio.role?.fr ?? ""}
                        onChange={(e) =>
                          updateBiography(index, {
                            ...bio,
                            role: { ...bio.role, fr: e.target.value },
                          })
                        }
                        placeholder="e.g., Manden Mansa"
                        className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={bio.kind}
                      onValueChange={(value: "person" | "institution") =>
                        updateBiography(index, { ...bio, kind: value })
                      }
                    >
                      <SelectTrigger className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="person">Person (Biography)</SelectItem>
                        <SelectItem value="institution">Institution (Explanation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Content / Biography</Label>
                    <div className="space-y-2">
                      <Textarea
                        value={bio.content?.en ?? ""}
                        onChange={(e) =>
                          updateBiography(index, {
                            ...bio,
                            content: { ...bio.content, en: e.target.value },
                          })
                        }
                        placeholder="English content..."
                        className="min-h-[6rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                      />
                      <Textarea
                        value={bio.content?.fr ?? ""}
                        onChange={(e) =>
                          updateBiography(index, {
                            ...bio,
                            content: { ...bio.content, fr: e.target.value },
                          })
                        }
                        placeholder="Contenu en français..."
                        className="min-h-[6rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-gold/60" />
                    Images
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-auto glass-panel border-gold/20 text-xs"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length > 0) void onUpload(index, files);
                      e.currentTarget.value = "";
                    }}
                  />
                </div>
                {(bio.images ?? []).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {(bio.images ?? []).map((url, imageIndex) => (
                      <div key={url} className="relative group/image">
                        <img
                          src={url}
                          alt=""
                          className="h-24 w-full rounded-lg border border-gold/20 object-cover transition-all group-hover/image:border-gold/40"
                        />
                        <button
                          type="button"
                          className="absolute -right-2 -top-2 rounded-full border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs glass-panel opacity-0 transition-opacity group-hover/image:opacity-100 hover:bg-red-500/40"
                          onClick={() => removeImage(index, imageIndex)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-6 text-sm text-muted-foreground">
                    No images uploaded yet. Add photos to display on the biography page.
                  </div>
                )}
              </div>

              {/* Meta Fields Section */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Additional Information (Meta Fields)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-gold/20 hover:bg-gold/10"
                    onClick={() => addMeta(index)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Field
                  </Button>
                </div>
                {(bio.meta ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(bio.meta ?? []).map((metaItem, metaIndex) => (
                      <div key={metaIndex} className="grid gap-2 md:grid-cols-[1fr_1fr_auto] items-end">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">Label</span>
                          <Input
                            value={metaItem.label?.en ?? ""}
                            onChange={(e) => updateMeta(index, metaIndex, "label", e.target.value)}
                            placeholder="e.g., Born, Established, Location"
                            className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">Value</span>
                          <Input
                            value={metaItem.value?.en ?? ""}
                            onChange={(e) => updateMeta(index, metaIndex, "value", e.target.value)}
                            placeholder="e.g., 1236, Bamako, West Africa"
                            className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                          />
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeMeta(index, metaIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-4 text-sm text-muted-foreground">
                    No additional fields. Click "Add Field" to include extra information like birth date, location, etc.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {biographies.length === 0 && (
          <div className="rounded-xl border border-dashed border-gold/20 bg-black/15 px-5 py-8 text-center text-sm text-muted-foreground">
            No biographies yet. Click "Add Biography" to create pages for people and institutions.
          </div>
        )}
      </div>
    </div>
  );
}
