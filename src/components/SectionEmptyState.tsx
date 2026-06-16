type SectionEmptyStateProps = {
  message: string;
};

export default function SectionEmptyState({ message }: SectionEmptyStateProps) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-gold/20 bg-black/20 px-6 py-10 text-center text-sm leading-7 text-muted-foreground sm:text-base">
      {message}
    </section>
  );
}
