export const BIOGRAPHY_DOC_EXTENSIONS = [".pdf", ".png"] as const;

export function biographyDocumentBasePath(slug: string, lang: "fr" | "en") {
  return `/biographies/${slug}-${lang}`;
}

export function biographyDocumentFilenames(slug: string, lang: "fr" | "en") {
  return BIOGRAPHY_DOC_EXTENSIONS.map((ext) => `${slug}-${lang}${ext}`);
}

export function isBiographyPdfUrl(url: string) {
  return /\.pdf($|\?)/i.test(url);
}

export function isBiographyImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif)($|\?)/i.test(url);
}

export async function resolveBiographyDocumentUrl(basePath: string): Promise<string | null> {
  for (const ext of BIOGRAPHY_DOC_EXTENSIONS) {
    const url = `${basePath}${ext}`;
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) continue;

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("text/html")) continue;

      return url;
    } catch {
      // try next extension
    }
  }
  return null;
}
