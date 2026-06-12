import { useState } from "react";

import ImageLightbox from "@/components/ImageLightbox";

type SectionHeroImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export default function SectionHeroImage({ src, alt, className }: SectionHeroImageProps) {
  const [hidden, setHidden] = useState(false);

  if (!src?.trim() || hidden) return null;

  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] border border-gold/15 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${className ?? ""}`}
    >
      <ImageLightbox
        src={src}
        alt={alt}
        onError={() => setHidden(true)}
        className="h-auto max-h-96 w-full object-cover"
      />
    </div>
  );
}
