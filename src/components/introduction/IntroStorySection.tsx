import type { LucideIcon } from "lucide-react";

import ImageLightbox from "@/components/ImageLightbox";
import GoldDivider from "@/components/introduction/GoldDivider";
import StoryCard from "@/components/introduction/StoryCard";
import type { IntroSection } from "@/features/introduction/intro-sections";
import { resolveSectionVisual } from "@/features/introduction/intro-sections";

type IntroStorySectionProps = {
  section: IntroSection;
  index: number;
  lang: "en" | "fr";
  imageSrc?: string;
  imageAlt: string;
};

function VisualFallback({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),rgba(5,5,5,0.95))] sm:min-h-[320px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-gold/25 bg-gold/10 text-gold shadow-[0_0_40px_rgba(212,175,55,0.15)]">
        <Icon className="h-9 w-9" />
      </div>
    </div>
  );
}

export default function IntroStorySection({
  section,
  index,
  lang,
  imageSrc,
  imageAlt,
}: IntroStorySectionProps) {
  const visual = resolveSectionVisual(section.heading, index);
  const Icon = visual.icon;
  const tagline = lang === "fr" ? visual.taglineFr : visual.taglineEn;
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  const imageBlock = (
    <StoryCard delay={0.05} className="h-full overflow-hidden p-0">
      {imageSrc ? (
        <div className="relative h-full min-h-[240px] overflow-hidden sm:min-h-[320px]">
          <ImageLightbox
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/50 via-transparent to-transparent" />
        </div>
      ) : (
        <VisualFallback Icon={Icon} />
      )}
    </StoryCard>
  );

  const textBlock = (
    <StoryCard delay={0.1} className="flex h-full flex-col justify-center p-6 sm:p-8 lg:p-10">
      <span className="mb-4 font-mono text-[11px] tracking-[0.35em] text-gold/45">{number}</span>
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D4AF37]/80">
        {tagline}
      </p>
      {section.heading ? (
        <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-tight gold-gradient-text">
          {section.heading}
        </h2>
      ) : null}
      <GoldDivider className="my-5" />
      <p className="max-w-prose text-base leading-8 text-foreground/85 whitespace-pre-line sm:text-[1.05rem]">
        {section.body}
      </p>
    </StoryCard>
  );

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
      <div className={reversed ? "lg:order-2" : "lg:order-1"}>{imageBlock}</div>
      <div className={reversed ? "lg:order-1" : "lg:order-2"}>{textBlock}</div>
    </section>
  );
}
