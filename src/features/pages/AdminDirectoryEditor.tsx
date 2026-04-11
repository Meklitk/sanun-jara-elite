import type { DirectoryData, DirectoryItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Globe, Plus, Trash2 } from "lucide-react";

function emptyDirectoryItem(): DirectoryItem {
  return {
    name: { en: "" },
    description: { en: "" },
  };
}

type DirectoryGroupProps = {
  icon: typeof Globe;
  title: string;
  description: string;
  items: DirectoryItem[];
  addLabel: string;
  onChange: (items: DirectoryItem[]) => void;
};

function DirectoryGroup({ icon: Icon, title, description, items, addLabel, onChange }: DirectoryGroupProps) {
  function updateItem(index: number, next: DirectoryItem) {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  }

  return (
    <section className="space-y-4 rounded-[1.6rem] border border-gold/15 bg-black/15 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label className="flex items-center gap-2 text-base font-display font-semibold text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient-bg shadow-lg shadow-gold/20">
              <Icon className="h-4 w-4 text-black" aria-hidden />
            </div>
            {title}
          </Label>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">{description}</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30"
          onClick={() => onChange([...items, emptyDirectoryItem()])}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-gold/20 bg-black/15 px-5 py-8 text-sm text-muted-foreground">
          No entries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={`${item.name.en ?? "item"}-${index}`} className="rounded-[1.3rem] border border-gold/12 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.28em] text-gold">
                  Entry {String(index + 1).padStart(2, "0")}
                </p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={item.name.en ?? ""}
                    onChange={(e) =>
                      updateItem(index, {
                        ...item,
                        name: { ...(item.name ?? {}), en: e.target.value },
                      })
                    }
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Relevant Information</Label>
                  <Textarea
                    value={item.description.en ?? ""}
                    onChange={(e) =>
                      updateItem(index, {
                        ...item,
                        description: { ...(item.description ?? {}), en: e.target.value },
                      })
                    }
                    className="min-h-[6.5rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type Props = {
  directory: DirectoryData;
  onChange: (directory: DirectoryData) => void;
};

export default function AdminDirectoryEditor({ directory, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            label: "Country entries",
            value: directory.countries.length,
            note: "Displayed alphabetically on the public page",
          },
          {
            label: "Organization entries",
            value: directory.organizations.length,
            note: "Displayed alphabetically on the public page",
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

      <DirectoryGroup
        icon={Globe}
        title="By Country"
        description="Add countries and their relevant information. The public page sorts this list alphabetically by country name."
        items={directory.countries}
        addLabel="Add Country"
        onChange={(countries) => onChange({ ...directory, countries })}
      />

      <DirectoryGroup
        icon={Building}
        title="By Organization"
        description="Add organizations and their relevant information. The public page also sorts this section alphabetically."
        items={directory.organizations}
        addLabel="Add Organization"
        onChange={(organizations) => onChange({ ...directory, organizations })}
      />
    </div>
  );
}
