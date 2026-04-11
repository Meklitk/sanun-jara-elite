import { usePages } from "@/api/pages";
import { useI18n } from "@/lib/i18n";

const defaultEmblemImage = "/images/coat-of-arms-mandenbB.jpeg";

type SiteCoatOfArmsProps = {
  className?: string;
};

export default function SiteCoatOfArms({ className = "" }: SiteCoatOfArmsProps) {
  const { t } = useI18n();
  const { data } = usePages();
  const introductionPage = data?.pages.find((page) => page.key === "introduction");
  const emblemImage = introductionPage?.images?.[1] || defaultEmblemImage;

  return (
    <section
      className={`w-full max-w-[240px] rounded-[1.85rem] border border-gold/15 bg-[linear-gradient(160deg,rgba(255,205,86,0.08),rgba(0,0,0,0.24))] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] ${className}`.trim()}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-[1.6rem] bg-gold/10 blur-2xl opacity-45" aria-hidden />
          <div className="relative overflow-hidden rounded-[1.45rem] border border-gold/18 bg-black/60 p-3 shadow-[0_18px_55px_rgba(0,0,0,0.2)]">
            <img
              src={emblemImage}
              alt={t.coatOfArms}
              className="h-44 w-full max-w-[200px] object-contain"
            />
          </div>
        </div>

        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold/72">
          {t.coatOfArms}
        </p>
      </div>
    </section>
  );
}
