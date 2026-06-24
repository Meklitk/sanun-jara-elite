import { http } from "./http";

export type BiographyProfile = {
  portrait?: string;
  summary?: {
    fr?: string;
    en?: string;
  };
};

export type BiographyProfilesMap = Record<string, BiographyProfile>;

export async function listBiographyFiles(token: string) {
  return http<{ files: string[] }>("/api/admin/biography-files", { token });
}

export async function listBiographyProfiles() {
  return http<{ profiles: BiographyProfilesMap }>("/api/biography-profiles");
}

export async function uploadBiographyPdf(
  file: File,
  slug: string,
  lang: "fr" | "en",
  token: string
) {
  const fd = new FormData();
  fd.append("slug", slug);
  fd.append("lang", lang);
  fd.append("file", file);
  return http<{ ok: boolean; filename: string; url: string }>("/api/admin/biography-file", {
    method: "POST",
    body: fd,
    token,
  });
}

export async function uploadBiographyPortrait(file: File, slug: string, token: string) {
  const fd = new FormData();
  fd.append("slug", slug);
  fd.append("file", file);
  return http<{ ok: boolean; portrait: string; profile: BiographyProfile }>(
    "/api/admin/biography-portrait",
    {
      method: "POST",
      body: fd,
      token,
    }
  );
}

export async function saveBiographyProfile(
  slug: string,
  summary: { fr: string; en: string },
  token: string
) {
  return http<{ ok: boolean; profile: BiographyProfile }>("/api/admin/biography-profile", {
    method: "PUT",
    body: JSON.stringify({ slug, summary }),
    token,
  });
}

export async function deleteBiographyPdf(slug: string, lang: "fr" | "en", token: string) {
  return http<{ ok: boolean }>("/api/admin/biography-file", {
    method: "DELETE",
    body: JSON.stringify({ slug, lang }),
    token,
  });
}

export async function deleteBiographyPortrait(slug: string, token: string) {
  return http<{ ok: boolean; profile: BiographyProfile }>("/api/admin/biography-portrait", {
    method: "DELETE",
    body: JSON.stringify({ slug }),
    token,
  });
}
