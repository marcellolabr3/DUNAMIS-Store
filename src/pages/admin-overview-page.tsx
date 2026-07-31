const summaryCards = [
  { label: 'Aguardando pagamento', value: '0' },
  { label: 'Comprovantes enviados', value: '0' },
  { label: 'Pagamentos confirmados', value: '0' },
  { label: 'Produtos com estoque baixo', value: '0' }
];

export function AdminOverviewPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Visao geral</h2>
        <p className="mt-2 text-sm text-text-light">
          Estrutura visual inicial do painel. Os indicadores serao integrados ao
          banco nas proximas etapas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            className="rounded-md border border-border bg-surface p-4 shadow-sm"
            key={card.label}
          >
            <p className="text-sm font-medium text-text-light">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-secondary">
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
