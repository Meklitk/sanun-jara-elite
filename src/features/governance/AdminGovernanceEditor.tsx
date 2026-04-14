import type { GovernanceBranch, GovernanceData } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

function emptyBranch(): GovernanceBranch {
  return {
    name: { en: "" },
    powers: { en: "" },
    selection: { en: "" },
    url: "",
  };
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

type Props = {
  governance: GovernanceData;
  onChange: (governance: GovernanceData) => void;
};

export default function AdminGovernanceEditor({ governance, onChange }: Props) {
  function updateUrlField(
    field:
      | "chiefdomUrl"
      | "mandenMansaUrl"
      | "mandenDjelibaUrl"
      | "mandenMoryUrl"
      | "governmentNameUrl"
      | "constitutionUrl",
    value: string
  ) {
    onChange({
      ...governance,
      [field]: value,
    });
  }

  function updateLocalizedField(
    field:
      | "chiefdom"
      | "mandenMansa"
      | "mandenDjeliba"
      | "mandenMory"
      | "governmentName"
      | "constitution"
      | "governmentType"
      | "corruptionSummary"
      | "riskSummary"
      | "taxInformation",
    value: string
  ) {
    onChange({
      ...governance,
      [field]: {
        ...(governance[field] ?? {}),
        en: value,
      },
    });
  }

  function updateBranch(index: number, next: GovernanceBranch) {
    const branches = [...(governance.branches ?? [])];
    branches[index] = next;
    onChange({ ...governance, branches });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Leadership fields",
            value: 4,
            note: "Chiefdom, Mansa, Djeliba, and Mory details",
          },
          {
            label: "Branch rows",
            value: governance.branches.length,
            note: "Institution rows shown in the public table",
          },
          {
            label: "Metric values",
            value: 2,
            note: "Corruption index and risk grade callouts",
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

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-4 rounded-[1.6rem] border border-gold/15 bg-black/15 p-5">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Leadership</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              These fields drive the key governance facts in the upper public layout. Add a biography URL to make a name clickable on the public page.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Chiefdom (Name)</Label>
            <Input
              value={governance.chiefdom.en ?? ""}
              onChange={(e) => updateLocalizedField("chiefdom", e.target.value)}
              placeholder="e.g., Manden Mansaya"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <Label className="text-[11px] text-muted-foreground mt-1">Biography Page URL</Label>
            <Input
              value={governance.chiefdomUrl ?? ""}
              onChange={(e) => updateUrlField("chiefdomUrl", e.target.value)}
              placeholder="/governance/biographies/manden-mansaya"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <p className="text-[10px] text-muted-foreground">
              Tip: Create the biography page below using slug "manden-mansaya" to add custom content and images.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Manden Mansa (Name)</Label>
            <Input
              value={governance.mandenMansa.en ?? ""}
              onChange={(e) => updateLocalizedField("mandenMansa", e.target.value)}
              placeholder="e.g., Mari Djata Keita V"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <Label className="text-[11px] text-muted-foreground mt-1">Biography Page URL</Label>
            <Input
              value={governance.mandenMansaUrl ?? ""}
              onChange={(e) => updateUrlField("mandenMansaUrl", e.target.value)}
              placeholder="/governance/biographies/mari-djata-keita-v"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <p className="text-[10px] text-muted-foreground">
              Tip: Create the biography page below using slug "mari-djata-keita-v" to add custom content and images.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Manden Djeliba (Name)</Label>
            <Input
              value={governance.mandenDjeliba.en ?? ""}
              onChange={(e) => updateLocalizedField("mandenDjeliba", e.target.value)}
              placeholder="e.g., Mabougnata Djeliba Ibrahim Diabate"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <Label className="text-[11px] text-muted-foreground mt-1">Biography Page URL</Label>
            <Input
              value={governance.mandenDjelibaUrl ?? ""}
              onChange={(e) => updateUrlField("mandenDjelibaUrl", e.target.value)}
              placeholder="/governance/biographies/mabougnata-djeliba-ibrahim-diabate"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <p className="text-[10px] text-muted-foreground">
              Example: Corrected spelling from "Dibla" to "Djeliba". Create biography page below using slug "mabougnata-djeliba-ibrahim-diabate".
            </p>
          </div>

          <div className="space-y-2">
            <Label>Manden Mory (Name)</Label>
            <Input
              value={governance.mandenMory.en ?? ""}
              onChange={(e) => updateLocalizedField("mandenMory", e.target.value)}
              placeholder="e.g., Mabougnata Alpha Omar Kaba"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <Label className="text-[11px] text-muted-foreground mt-1">Biography Page URL</Label>
            <Input
              value={governance.mandenMoryUrl ?? ""}
              onChange={(e) => updateUrlField("mandenMoryUrl", e.target.value)}
              placeholder="/governance/biographies/mabougnata-alpha-omar-kaba"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <p className="text-[10px] text-muted-foreground">
              Tip: Create the biography page below using slug "mabougnata-alpha-omar-kaba" to add custom content and images.
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-[1.6rem] border border-gold/15 bg-black/15 p-5">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">State Structure</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Use these entries for the government name, constitution, and structural notes displayed beside the leadership block. Institution names can also point to biography pages.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Government Name</Label>
            <Input
              value={governance.governmentName.en ?? ""}
              onChange={(e) => updateLocalizedField("governmentName", e.target.value)}
              placeholder="e.g., Manden Empire"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <Label className="text-[11px] text-muted-foreground mt-1">Biography Page URL</Label>
            <Input
              value={governance.governmentNameUrl ?? ""}
              onChange={(e) => updateUrlField("governmentNameUrl", e.target.value)}
              placeholder="/governance/biographies/manden-empire"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Constitution</Label>
            <Input
              value={governance.constitution.en ?? ""}
              onChange={(e) => updateLocalizedField("constitution", e.target.value)}
              placeholder="e.g., Kouroukan Fouga, adopted in 1236"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
            <Label className="text-[11px] text-muted-foreground mt-1">Biography Page URL</Label>
            <Input
              value={governance.constitutionUrl ?? ""}
              onChange={(e) => updateUrlField("constitutionUrl", e.target.value)}
              placeholder="/governance/biographies/kouroukan-fouga"
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Type of Government</Label>
            <Input
              value={governance.governmentType.en ?? ""}
              onChange={(e) => updateLocalizedField("governmentType", e.target.value)}
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Tax Information</Label>
            <Input
              value={governance.taxInformation.en ?? ""}
              onChange={(e) => updateLocalizedField("taxInformation", e.target.value)}
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone / Contact</Label>
            <Input
              value={governance.phone ?? ""}
              onChange={(e) => onChange({ ...governance, phone: e.target.value })}
              className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-4 rounded-[1.6rem] border border-gold/15 bg-black/15 p-5">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Corruption Index</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              The public page shows the index value as a callout alongside the supporting explanation.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Index Value</Label>
            <Input
              value={governance.corruptionIndex}
              onChange={(e) => onChange({ ...governance, corruptionIndex: e.target.value })}
              className="border-gold/20 bg-black/20 font-display focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Explanation</Label>
            <Textarea
              value={governance.corruptionSummary.en ?? ""}
              onChange={(e) => updateLocalizedField("corruptionSummary", e.target.value)}
              className="min-h-[8rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-[1.6rem] border border-gold/15 bg-black/15 p-5">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Risk Index</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Use the grade and summary to mirror the clean institutional scorecard style from the reference.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Risk Grade</Label>
            <Input
              value={governance.riskIndex}
              onChange={(e) => onChange({ ...governance, riskIndex: e.target.value })}
              className="border-gold/20 bg-black/20 font-display focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Explanation</Label>
            <Textarea
              value={governance.riskSummary.en ?? ""}
              onChange={(e) => updateLocalizedField("riskSummary", e.target.value)}
              className="min-h-[8rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
            />
          </div>
        </section>
      </div>

      <section className="space-y-4 rounded-[1.6rem] border border-gold/15 bg-black/15 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Branches of Government</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              These rows are shown in the public governance table with branch name, main powers, and selection criteria. When a branch URL is filled, the branch name links to that institution profile.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="gold-gradient-bg text-black font-semibold hover:shadow-lg hover:shadow-gold/30"
            onClick={() => onChange({ ...governance, branches: [...governance.branches, emptyBranch()] })}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Branch
          </Button>
        </div>

        <div className="space-y-4">
          {governance.branches.map((branch, index) => (
            <div
              key={`${branch.name.en ?? "branch"}-${index}`}
              className="rounded-[1.35rem] border border-gold/12 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.28em] text-gold">
                  Branch {String(index + 1).padStart(2, "0")}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-gold"
                    disabled={index === 0}
                    onClick={() => onChange({ ...governance, branches: moveItem(governance.branches, index, index - 1) })}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-gold"
                    disabled={index === governance.branches.length - 1}
                    onClick={() => onChange({ ...governance, branches: moveItem(governance.branches, index, index + 1) })}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() =>
                      onChange({
                        ...governance,
                        branches: governance.branches.filter((_, branchIndex) => branchIndex !== index),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_220px]">
                <div className="space-y-2">
                  <Label>Branch Name</Label>
                  <Input
                    value={branch.name.en ?? ""}
                    onChange={(e) =>
                      updateBranch(index, {
                        ...branch,
                        name: { ...(branch.name ?? {}), en: e.target.value },
                      })
                    }
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Main Powers</Label>
                  <Textarea
                    value={branch.powers.en ?? ""}
                    onChange={(e) =>
                      updateBranch(index, {
                        ...branch,
                        powers: { ...(branch.powers ?? {}), en: e.target.value },
                      })
                    }
                    className="min-h-[6.5rem] border-gold/20 bg-black/20 resize-y focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Selection Criteria</Label>
                  <Input
                    value={branch.selection.en ?? ""}
                    onChange={(e) =>
                      updateBranch(index, {
                        ...branch,
                        selection: { ...(branch.selection ?? {}), en: e.target.value },
                      })
                    }
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>Branch Biography URL</Label>
                <Input
                  value={branch.url ?? ""}
                  onChange={(e) =>
                    updateBranch(index, {
                      ...branch,
                      url: e.target.value,
                    })
                  }
                  placeholder="/governance/biographies/reflection-committee"
                  className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
