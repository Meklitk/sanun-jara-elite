import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "./http";
import type { Content } from "./types";

export function useContent() {
  return useQuery({
    queryKey: ["content"],
    queryFn: () => http<{ content: Content[] }>("/api/content"),
  });
}

export function useAllContent(token: string) {
  return useQuery({
    queryKey: ["content", "all"],
    queryFn: () => http<{ content: Content[] }>("/api/content/all", { token }),
    enabled: Boolean(token),
  });
}

export function useContentBySlug(slug: string) {
  return useQuery({
    queryKey: ["content", slug],
    queryFn: () => http<{ content: Content }>(`/api/content/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      token,
    }: {
      data: Omit<Content, "_id" | "createdAt" | "updatedAt">;
      token: string;
    }) => {
      return http<{ content: Content }>("/api/content", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
      token,
    }: {
      id: string;
      data: Partial<Content>;
      token: string;
    }) => {
      return http<{ content: Content }>(`/api/content/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        token,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      return http<{ ok: boolean }>(`/api/content/${id}`, {
        method: "DELETE",
        token,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
