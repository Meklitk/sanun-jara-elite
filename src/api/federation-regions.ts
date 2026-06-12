import { http } from "./http";
import type { FederationRegionCode } from "@/data/federation-regions";

export async function listFederationRegions() {
  return http<{ regions: Record<string, boolean> }>("/api/federation-regions");
}

export async function uploadFederationRegion(file: File, code: FederationRegionCode, token: string) {
  const fd = new FormData();
  fd.append("code", code);
  fd.append("file", file);
  return http<{ ok: boolean; code: string; url: string }>("/api/admin/federation-region", {
    method: "POST",
    body: fd,
    token,
  });
}

export async function deleteFederationRegion(code: FederationRegionCode, token: string) {
  return http<{ ok: boolean; code: string; filename: string }>(
    `/api/admin/federation-region/${encodeURIComponent(code)}`,
    {
      method: "DELETE",
      token,
    }
  );
}
