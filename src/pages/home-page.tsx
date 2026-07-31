export function HomePage() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-6xl content-center gap-6 px-4 py-16">
      <p className="text-sm font-semibold uppercase text-primary-hover">
        Loja virtual da igreja
      </p>
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold text-secondary sm:text-5xl">
          DUNAMIS STORE
        </h1>
        <p className="text-lg leading-8 text-text-light">
          Base inicial do e-commerce com React, TypeScript, Vite e Tailwind CSS.
        </p>
      </div>
    </section>
  );
}
