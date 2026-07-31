interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto grid min-h-[50vh] max-w-4xl content-center gap-4 px-4 py-16">
      <p className="w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
        Em desenvolvimento
      </p>
      <h1 className="text-3xl font-black text-secondary">{title}</h1>
      <p className="max-w-2xl text-text-light">{description}</p>
    </section>
  );
}
