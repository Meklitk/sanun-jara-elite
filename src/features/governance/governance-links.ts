export function isExternalUrl(url: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith("//");
}

export function isInternalAppPath(url?: string) {
  return Boolean(url && url.startsWith("/") && !url.startsWith("//"));
}

export function extractBiographySlug(url?: string) {
  if (!isInternalAppPath(url)) return "";

  const pathname = url.split(/[?#]/, 1)[0];
  const match = pathname.match(/^\/governance\/biographies\/([^/]+)$/);
  return match?.[1] ?? "";
}
