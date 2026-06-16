import { useParams, Navigate } from "react-router-dom";
import { useContentBySlug } from "@/api/content";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { sectionEmoji } from "@/lib/section-emojis";

export default function ContentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { localize, t, lang } = useI18n();
  const { data, isLoading, error } = useContentBySlug(slug || "");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data?.content) {
    return <Navigate to="/404" replace />;
  }

  const content = data.content;
  const emoji = sectionEmoji(content.icon || "FileText");
  const title = localize(content.title) || content.slug;
  const bodyContent = localize(content.content);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-gold/20 bg-gradient-to-br from-black/60 to-black/40 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,205,86,0.15),_transparent_50%)]" />
        <div className="relative flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-black/40 text-3xl shadow-lg"
            aria-hidden
          >
            {emoji}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold gold-gradient-text sm:text-3xl">{title}</h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">/content/{content.slug}</p>
          </div>
        </div>
      </div>

      {bodyContent ? (
        <Card className="glass-panel p-6 sm:p-8 border-gold/20">
          <div className="prose prose-invert max-w-none">
            {bodyContent.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      ) : null}

      {content.images && content.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.images.map((url, index) => (
            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-gold/20">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {content.links && content.links.length > 0 && (
        <Card className="glass-panel p-6 border-gold/20">
          <h2 className="font-display text-lg text-gold mb-4">
            {lang === "fr" ? "Liens utiles" : "Useful links"}
          </h2>
          <ul className="space-y-2">
            {content.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  {localize(link.label) || link.url}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
