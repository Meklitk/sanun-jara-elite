import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LazyGalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  onClick?: () => void;
};

export default function LazyGalleryImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onClick,
}: LazyGalleryImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = (
    <div ref={ref} className="relative overflow-hidden">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-gold/5 via-black/40 to-gold/5"
          aria-hidden
        />
      )}
      {visible ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes={sizes}
          className={cn(
            "transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className={cn("bg-black/30", className)} aria-hidden />
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        aria-label="View image"
      >
        {content}
      </button>
    );
  }

  return content;
}
