export function HomePage() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid min-h-[66vh] max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <p className="w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
            Loja virtual da igreja
          </p>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-black text-secondary sm:text-5xl">
              DUNAMIS STORE
            </h1>
            <p className="text-lg leading-8 text-text-light">
              Identidade visual inicial em amarelo e preto, com layout
              responsivo preparado para catalogo, carrinho, checkout e painel.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-md bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-text"
              href="/catalogo"
            >
              Ver catalogo
            </a>
            <a
              className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-bold text-secondary transition hover:border-primary hover:bg-primary/10"
              href="/pedido"
            >
              Acompanhar pedido
            </a>
          </div>
        </div>

        <div className="rounded-md border border-border bg-background p-5 shadow-sm">
          <div className="aspect-[4/3] rounded bg-secondary p-6 text-white">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Banner editavel
                </p>
                <h2 className="mt-3 text-3xl font-black">DUNAMIS STORE</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/70">
                Area reservada para imagens e campanhas configuraveis nas
                proximas etapas do painel administrativo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
