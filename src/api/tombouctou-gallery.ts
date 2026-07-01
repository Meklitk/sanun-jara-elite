import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "./http";
import type { LocalizedString, TombouctouGalleryItem, TombouctouGallerySize } from "./types";

export function useTombouctouGallery() {
  return useQuery({
    queryKey: ["tombouctou-gallery"],
    queryFn: () => http<{ items: TombouctouGalleryItem[] }>("/api/tombouctou-gallery"),
    staleTime: 60_000,
  });
}

export async function listTombouctouGallery() {
  return http<{ items: TombouctouGalleryItem[] }>("/api/tombouctou-gallery");
}

export async function createTombouctouGalleryItem(
  file: File,
  token: string,
  meta?: {
    title?: Partial<LocalizedString>;
    caption?: Partial<LocalizedString>;
    altText?: Partial<LocalizedString>;
    size?: TombouctouGallerySize;
    isFeatured?: boolean;
  }
) {
  const fd = new FormData();
  fd.append("file", file);
  if (meta?.title) fd.append("title", JSON.stringify(meta.title));
  if (meta?.caption) fd.append("caption", JSON.stringify(meta.caption));
  if (meta?.altText) fd.append("altText", JSON.stringify(meta.altText));
  if (meta?.size) fd.append("size", meta.size);
  if (meta?.isFeatured) fd.append("isFeatured", "true");

  return http<{ item: TombouctouGalleryItem }>("/api/admin/tombouctou-gallery", {
    method: "POST",
    body: fd,
    token,
  });
}

export async function updateTombouctouGalleryItem(
  id: string,
  patch: Partial<{
    title: Partial<LocalizedString>;
    caption: Partial<LocalizedString>;
    altText: Partial<LocalizedString>;
    size: TombouctouGallerySize;
    displayOrder: number;
    isFeatured: boolean;
  }>,
  token: string
) {
  return http<{ item: TombouctouGalleryItem }>(`/api/admin/tombouctou-gallery/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
    token,
  });
}

export async function reorderTombouctouGallery(ids: string[], token: string) {
  return http<{ items: TombouctouGalleryItem[] }>("/api/admin/tombouctou-gallery/reorder", {
    method: "PUT",
    body: JSON.stringify({ ids }),
    token,
  });
}

export async function deleteTombouctouGalleryItem(id: string, token: string) {
  return http<{ ok: boolean }>(`/api/admin/tombouctou-gallery/${id}`, {
    method: "DELETE",
    token,
  });
}

export function useCreateTombouctouGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      token,
      meta,
    }: {
      file: File;
      token: string;
      meta?: Parameters<typeof createTombouctouGalleryItem>[2];
    }) => createTombouctouGalleryItem(file, token, meta),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tombouctou-gallery"] });
    },
  });
}

export function useUpdateTombouctouGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
      token,
    }: {
      id: string;
      patch: Parameters<typeof updateTombouctouGalleryItem>[1];
      token: string;
    }) => updateTombouctouGalleryItem(id, patch, token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tombouctou-gallery"] });
    },
  });
}

export function useReorderTombouctouGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, token }: { ids: string[]; token: string }) =>
      reorderTombouctouGallery(ids, token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tombouctou-gallery"] });
    },
  });
}

export function useDeleteTombouctouGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) =>
      deleteTombouctouGalleryItem(id, token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tombouctou-gallery"] });
    },
  });
}
