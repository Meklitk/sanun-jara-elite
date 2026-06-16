import { http } from "./http";
import type { CardImageKey } from "@/lib/card-images";

export async function listCardImages() {
  return http<{ files: Record<string, boolean>; urls: Record<string, string> }>("/api/card-images");
}

export async function uploadCardImage(file: File, slot: CardImageKey, token: string) {
  const fd = new FormData();
  fd.append("slot", slot);
  fd.append("file", file);
  return http<{ ok: boolean; slot: string; url: string; filename: string }>(
    "/api/admin/card-image",
    {
      method: "POST",
      body: fd,
      token,
    }
  );
}

export async function deleteCardImage(slot: CardImageKey, token: string) {
  return http<{ ok: boolean; slot: string; filename: string }>(
    `/api/admin/card-image/${encodeURIComponent(slot)}`,
    {
      method: "DELETE",
      token,
    }
  );
}
