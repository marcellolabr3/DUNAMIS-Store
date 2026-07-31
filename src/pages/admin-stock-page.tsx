import { Boxes, PackageCheck } from 'lucide-react';

export function AdminStockPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Estoque</h2>
        <p className="mt-2 text-sm text-text-light">
          Acompanhe quantidades e priorize produtos com estoque baixo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <Boxes
              aria-hidden="true"
              className="mt-1 text-primary-hover"
              size={22}
            />
            <div>
              <h3 className="font-bold text-secondary">Controle por variacao</h3>
              <p className="mt-1 text-sm leading-6 text-text-light">
                O estoque ja e controlado no cadastro do produto, em cada
                variacao de tamanho, cor ou modelo.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <PackageCheck
              aria-hidden="true"
              className="mt-1 text-primary-hover"
              size={22}
            />
            <div>
              <h3 className="font-bold text-secondary">Proxima melhoria</h3>
              <p className="mt-1 text-sm leading-6 text-text-light">
                A visao consolidada de estoque sera conectada aos produtos para
                ajuste rapido das quantidades.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
