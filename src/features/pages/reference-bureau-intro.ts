const STALE_REFERENCE_BUREAU_MARKERS = [
  "begin as placeholders",
  "become more detailed over time",
  "register entrepreneurial interest",
  "contribute through cotiser",
  "forwarded to info@sanunjara.com",
  "peuvent commencer comme des espaces réservés",
  "deviennent plus détaillés au fil du temps",
  "intérêts entrepreneuriaux",
];

export function resolveReferenceBureauIntro(cmsContent: string, fallback: string) {
  const trimmed = cmsContent.trim();
  if (!trimmed) return fallback;

  const lower = trimmed.toLowerCase();
  if (STALE_REFERENCE_BUREAU_MARKERS.some((marker) => lower.includes(marker))) {
    return fallback;
  }

  const paragraphs = trimmed
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => {
      const paragraphLower = paragraph.toLowerCase();
      return !STALE_REFERENCE_BUREAU_MARKERS.some((marker) => paragraphLower.includes(marker));
    });

  return paragraphs.length > 0 ? paragraphs.join("\n\n") : fallback;
}
