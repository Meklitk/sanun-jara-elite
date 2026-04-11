import type { UtilityCard } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import type { UtilityCardDefinition } from "./utility-page-config";
import { emptyUtilityCard } from "./utility-page-config";

type Props = {
  title: string;
  description: string;
  cards: UtilityCard[];
  definitions: UtilityCardDefinition[];
  onChange: (cards: UtilityCard[]) => void;
};

export default function AdminUtilityCardsEditor({
  title,
  description,
  cards,
  definitions,
  onChange,
}: Props) {
  const { t } = useI18n();
  const configuredCount = definitions.filter((definition) => {
    const card = cards.find((entry) => entry.id === definition.id);
    return Boolean(card?.title?.en?.trim() || card?.description?.en?.trim() || card?.url?.trim());
  }).length;
  const linkedCount = definitions.filter((definition) => {
    const card = cards.find((entry) => entry.id === definition.id);
    return Boolean(card?.url?.trim());
  }).length;

  function updateCard(id: string, updater: (card: UtilityCard) => UtilityCard) {
    const existingIndex = cards.findIndex((entry) => entry.id === id);

    if (existingIndex === -1) {
      onChange([...cards, updater(emptyUtilityCard(id))]);
      return;
    }

    const copy = [...cards];
    copy[existingIndex] = updater(copy[existingIndex]);
    onChange(copy);
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-[linear-gradient(140deg,rgba(255,205,86,0.08),rgba(255,205,86,0.02))] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <div className="p-5">
          <Label className="text-base font-display font-semibold text-foreground">{title}</Label>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-px border-t border-gold/10 bg-gold/10 md:grid-cols-2">
          {[
            {
              label: "Configured cards",
              value: configuredCount,
              note: "Cards with some public content entered",
            },
            {
              label: "Linked cards",
              value: linkedCount,
              note: "Cards with a destination URL set",
            },
          ].map((item) => (
            <div key={item.label} className="bg-black/25 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">{item.label}</p>
              <p className="mt-3 text-3xl font-display font-semibold text-foreground">{String(item.value).padStart(2, "0")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {definitions.map((definition, index) => {
          const card = cards.find((entry) => entry.id === definition.id) ?? emptyUtilityCard(definition.id);

          return (
            <section
              key={definition.id}
              id={definition.id}
              className="rounded-[1.55rem] border border-gold/12 bg-black/18 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.12)] scroll-mt-28"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gold-gradient-bg shadow-lg shadow-gold/20">
                  <definition.icon className="h-5 w-5 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">
                    {title} Card {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{t[definition.titleKey]}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This item is linked from the top dropdown and shown on the public page.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                <div className="space-y-2">
                  <Label>Card Title</Label>
                  <Input
                    value={card.title.en ?? ""}
                    placeholder={t[definition.titleKey]}
                    onChange={(event) =>
                      updateCard(definition.id, (current) => ({
                        ...current,
                        title: { ...(current.title ?? {}), en: event.target.value },
                      }))
                    }
                    className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={card.description.en ?? ""}
                    placeholder={t[definition.descriptionKey]}
                    onChange={(event) =>
                      updateCard(definition.id, (current) => ({
                        ...current,
                        description: { ...(current.description ?? {}), en: event.target.value },
                      }))
                    }
                    className="min-h-[6.5rem] resize-y border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>Destination URL</Label>
                <Input
                  type="url"
                  value={card.url ?? ""}
                  placeholder="https://example.com/form or /academy/nko"
                  onChange={(event) =>
                    updateCard(definition.id, (current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                  className="border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20"
                />
                <p className="text-xs text-muted-foreground">
                  Leave this empty if the card should be visible as a section only for now.
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
