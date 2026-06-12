import { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminT } from "./admin-i18n";

const SECTIONS = [
  { key: "sanunJara", headingEn: "Sanun Jara", headingFr: "Sanun Jara" },
  { key: "manden", headingEn: "Manden", headingFr: "Manden" },
  { key: "vision", headingEn: "Vision", headingFr: "Vision" },
  { key: "mission", headingEn: "Mission", headingFr: "Mission" },
  { key: "values", headingEn: "Fundamental Values", headingFr: "Valeurs fondamentales" },
  { key: "culture", headingEn: "Culture", headingFr: "Culture" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

type SectionMap = Record<SectionKey, string>;

function parseSections(content: string, lang: "en" | "fr"): SectionMap {
  const empty = Object.fromEntries(SECTIONS.map((s) => [s.key, ""])) as SectionMap;
  if (!content.trim()) return empty;

  if (!content.includes("## ")) {
    empty.sanunJara = content.trim();
    return empty;
  }

  const headings = new Map(
    SECTIONS.map((s) => [lang === "fr" ? s.headingFr : s.headingEn, s.key]),
  );

  for (const block of content.split(/^## /m).filter(Boolean)) {
    const [headingLine, ...rest] = block.split("\n");
    const key = headings.get(headingLine.trim());
    if (key) {
      empty[key] = rest.join("\n").trim();
    }
  }

  return empty;
}

function buildContent(sections: SectionMap, lang: "en" | "fr") {
  return SECTIONS.map((section) => {
    const body = sections[section.key]?.trim();
    if (!body) return "";
    const heading = lang === "fr" ? section.headingFr : section.headingEn;
    return `## ${heading}\n\n${body}`;
  })
    .filter(Boolean)
    .join("\n\n");
}

type Props = {
  contentEn: string;
  contentFr: string;
  onChange: (next: { en: string; fr: string }) => void;
};

export default function IntroductionSectionsEditor({ contentEn, contentFr, onChange }: Props) {
  const t = useAdminT();
  const enSections = useMemo(() => parseSections(contentEn, "en"), [contentEn]);
  const frSections = useMemo(() => parseSections(contentFr, "fr"), [contentFr]);

  function updateSection(key: SectionKey, lang: "en" | "fr", value: string) {
    const nextEn = { ...enSections, ...(lang === "en" ? { [key]: value } : {}) };
    const nextFr = { ...frSections, ...(lang === "fr" ? { [key]: value } : {}) };
    onChange({
      en: buildContent(nextEn, "en"),
      fr: buildContent(nextFr, "fr"),
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-xs leading-6 text-muted-foreground">{t.introSectionsHint}</p>

      {SECTIONS.map((section) => (
        <div
          key={section.key}
          className="rounded-[1.2rem] border border-gold/15 bg-black/20 p-4 sm:p-5"
        >
          <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
            <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold to-gold/50" />
            {section.headingFr}
          </Label>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">
                English
              </span>
              <Textarea
                className="min-h-28 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed focus:border-gold/50 focus:ring-gold/20"
                placeholder={`${section.headingEn}…`}
                value={enSections[section.key]}
                onChange={(e) => updateSection(section.key, "en", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-semibold">
                Français
              </span>
              <Textarea
                className="min-h-28 glass-panel border-gold/20 bg-black/20 resize-y leading-relaxed focus:border-gold/50 focus:ring-gold/20"
                placeholder={`${section.headingFr}…`}
                value={frSections[section.key]}
                onChange={(e) => updateSection(section.key, "fr", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { parseSections as parseIntroductionSectionsForAdmin, buildContent as buildIntroductionContentForAdmin };
