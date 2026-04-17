import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { usePages } from "@/api/pages";
import { cn } from "@/lib/utils";

interface SiteFeaturedImageProps {
  className?: string;
}

export default function SiteFeaturedImage({ className }: SiteFeaturedImageProps) {
  const location = useLocation();
  const { data } = usePages();

  const featuredImage = useMemo(() => {
    if (!data?.pages) return null;
    
    // Find current page based on path
    const path = location.pathname;
    const pageKey = path === "/" ? "introduction" : path.replace("/", "").split("/")[0];
    
    const currentPage = data.pages.find((p) => p.key === pageKey);
    
    // Return featuredImage if set, otherwise first image, or null
    return currentPage?.featuredImage || currentPage?.images?.[0] || null;
  }, [data, location.pathname]);

  if (!featuredImage) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gold/20 bg-gradient-to-b from-black/60 to-black/40 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gold/15">
        <img
          src={featuredImage}
          alt="Featured"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/70">
        Featured Image
      </p>
    </div>
  );
}
