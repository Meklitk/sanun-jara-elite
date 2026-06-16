import { useState } from "react";

import { SectionEmojiVisual } from "@/components/SectionEmojiVisual";

type SectionEmojiHeaderProps = {
  emoji?: string;
  imageUrl?: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function SectionEmojiHeader({
  emoji,
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  description,
  children,
}: SectionEmojiHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <section className="rounded-[2rem] border border-gold/15 bg-[linear-gradient(145deg,rgba(0,0,0,0.94),rgba(39,25,8,0.9))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
      {showImage ? (
        <div className="mb-6 overflow-hidden rounded-2xl border border-gold/20 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-44 w-full object-cover sm:h-52 lg:h-56"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : null}

      <div className="mb-5 flex items-start gap-4">
        {!showImage ? <SectionEmojiVisual emoji={emoji ?? "✨"} size="header" /> : null}
        <div className="min-w-0 pt-1">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold/72">{eyebrow}</p>
          <h1 className="mt-1 text-3xl font-bold gold-gradient-text sm:text-4xl lg:text-5xl">{title}</h1>
        </div>
      </div>

      <p className="max-w-3xl text-base leading-8 text-foreground/76">{description}</p>

      {children}
    </section>
  );
}
