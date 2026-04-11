import type { TimelineItem } from "@/api/types";

function slugifySegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isExternalUrl(url: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith("//");
}

export function isInternalAppPath(url?: string) {
  return Boolean(url && url.startsWith("/") && !url.startsWith("//"));
}

export function buildHistoryTimelineSlug(item: TimelineItem, index: number) {
  const title = item.title?.en?.trim() || item.title?.fr?.trim() || "";
  const year = item.year?.trim() || "";
  const slug = [title, year].map(slugifySegment).filter(Boolean).join("-");

  return slug || `timeline-event-${index + 1}`;
}

export function extractHistoryTimelineSlug(url?: string) {
  if (!isInternalAppPath(url)) return "";

  const pathname = url.split(/[?#]/, 1)[0];
  const match = pathname.match(/^\/history\/timeline\/([^/]+)$/);
  return match?.[1] ?? "";
}

export function resolveHistoryTimelineLink(item: TimelineItem, index: number) {
  const customUrl = item.url?.trim() || "";
  const legacyMatch = customUrl.match(/^\/timeline\/([^/]+)$/);
  const normalizedCustomUrl = legacyMatch ? `/history/timeline/${legacyMatch[1]}` : customUrl;
  const slug = extractHistoryTimelineSlug(normalizedCustomUrl) || buildHistoryTimelineSlug(item, index);

  return {
    slug,
    href: normalizedCustomUrl || `/history/timeline/${slug}`,
  };
}
