import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { listCardImages } from "@/api/card-images";
import {
  CARD_IMAGES,
  SECTION_CARD_IMAGE_KEYS,
  type CardImageKey,
} from "@/lib/card-images";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function absolutizeImageUrl(url: string): string {
  if (!url.startsWith("/")) return url;
  return `${API_BASE_URL}${url}`;
}

type CardImagesContextValue = {
  resolve: (slot: CardImageKey) => string;
  resolveSection: (sectionKey: string) => string | undefined;
  urls: Record<string, string>;
  isLoading: boolean;
};

const CardImagesContext = createContext<CardImagesContextValue>({
  resolve: (slot) => CARD_IMAGES[slot],
  resolveSection: (sectionKey) => {
    const slot = SECTION_CARD_IMAGE_KEYS[sectionKey];
    return slot ? CARD_IMAGES[slot] : undefined;
  },
  urls: {},
  isLoading: false,
});

export function CardImagesProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["card-images"],
    queryFn: listCardImages,
    staleTime: 60_000,
  });

  const urls = data?.urls ?? {};

  const value = useMemo<CardImagesContextValue>(
    () => ({
      urls,
      isLoading,
      resolve: (slot) => absolutizeImageUrl(urls[slot] || CARD_IMAGES[slot]),
      resolveSection: (sectionKey) => {
        const slot = SECTION_CARD_IMAGE_KEYS[sectionKey];
        if (!slot) return undefined;
        return absolutizeImageUrl(urls[slot] || CARD_IMAGES[slot]);
      },
    }),
    [urls, isLoading]
  );

  return <CardImagesContext.Provider value={value}>{children}</CardImagesContext.Provider>;
}

export function useCardImages() {
  return useContext(CardImagesContext);
}
