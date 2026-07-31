import { ImagePlus, ListTree } from 'lucide-react';

export function AdminCategoriesPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Categorias</h2>
        <p className="mt-2 text-sm text-text-light">
          Organize os produtos por categorias, imagem e ordem de exibicao.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <ListTree
              aria-hidden="true"
              className="mt-1 text-primary-hover"
              size={22}
            />
            <div>
              <h3 className="font-bold text-secondary">Categorias da loja</h3>
              <p className="mt-1 text-sm leading-6 text-text-light">
                Use esta area para separar camisetas, livros, acessorios,
                eventos e itens infantis.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <ImagePlus
              aria-hidden="true"
              className="mt-1 text-primary-hover"
              size={22}
            />
            <div>
              <h3 className="font-bold text-secondary">Proxima melhoria</h3>
              <p className="mt-1 text-sm leading-6 text-text-light">
                A edicao completa de categorias sera conectada aos registros do
                banco com imagem, slug, status e ordem.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
