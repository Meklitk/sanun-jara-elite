import type { Page } from "@/api/types";
import { usePages } from "@/api/pages";
import { useI18n } from "@/lib/i18n";

function MessageCard({ message }: { message: string }) {
  return (
    <div className="rounded-[1.75rem] border border-gold/15 bg-black/35 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-56 rounded-full bg-muted/40" />
      <div className="h-56 rounded-[1.75rem] bg-muted/20" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-36 rounded-[1.5rem] bg-muted/20" />
        <div className="h-36 rounded-[1.5rem] bg-muted/20" />
      </div>
    </div>
  );
}

export function PageErrorState() {
  const { t } = useI18n();
  return <MessageCard message={t.pageError} />;
}

export function PageNotFoundState() {
  const { t } = useI18n();
  return <MessageCard message={t.pageNotFound} />;
}

export function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function useCmsPage(pageKey: string) {
  const { data, isLoading, error } = usePages();
  const { localize } = useI18n();

  const page = data?.pages.find((entry) => entry.key === pageKey);

  return {
    page,
    title: localize(page?.title),
    content: localize(page?.content),
    isLoading,
    error,
    localize,
  };
}

export function resolvePageLink(page: Page | undefined, index: number) {
  return page?.links?.[index]?.url || "";
}
