import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "./http";
import type { Page } from "./types";

export function usePages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: () => http<{ pages: Page[] }>("/api/pages"),
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch, token }: { id: string; patch: Partial<Page>; token: string }) => {
      return http<{ page: Page }>(`/api/pages/${id}`, {
        method: "PUT",
        body: JSON.stringify(patch),
        token,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

/** Creates any missing default section documents (e.g. introduction) without overwriting existing content. */
export function useEnsurePages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) =>
      http<{ ok: boolean; pages: Page[] }>("/api/admin/ensure-pages", { method: "POST", token }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

