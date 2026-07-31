import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCart } from '../hooks/use-cart';
import { formatMoney } from '../utils/money';

export function CartPage() {
  const { lines, summary, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <section className="mx-auto grid min-h-[50vh] max-w-4xl content-center gap-4 px-4 py-16 text-center">
        <p className="mx-auto w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
          Carrinho
        </p>
        <h1 className="text-3xl font-black text-secondary">
          Seu carrinho esta vazio
        </h1>
        <p className="text-text-light">
          Escolha produtos no catalogo para iniciar o pedido.
        </p>
        <Link
          className="mx-auto mt-2 rounded-md bg-secondary px-5 py-3 text-sm font-bold text-white hover:bg-text"
          to="/catalogo"
        >
          Continuar comprando
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_22rem]">
      <div>
        <p className="text-sm font-bold uppercase text-primary-hover">Carrinho</p>
        <h1 className="mt-2 text-3xl font-black text-secondary">
          Revise seus produtos
        </h1>
        <div className="mt-6 grid gap-4">
          {lines.map((line) => {
            const mainImage = line.product.images.find((image) => image.isMain);

            return (
              <article
                className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-sm sm:grid-cols-[7rem_1fr_auto]"
                key={line.id}
              >
                <img
                  alt={mainImage?.altText ?? line.product.name}
                  className="aspect-square w-full rounded bg-background object-cover"
                  src={mainImage?.url ?? '/demo/products/camiseta-classica.svg'}
                />

                <div className="min-w-0">
                  <Link
                    className="font-bold text-secondary hover:text-primary-hover"
                    to={`/produto/${line.product.slug}`}
                  >
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-text-light">
                    Variacao: {line.variant.name}
                  </p>
                  <p className="mt-1 text-sm text-text-light">
                    SKU: {line.variant.sku}
                  </p>
                  <p className="mt-3 font-bold text-secondary">
                    {formatMoney(line.unitPrice)}
                  </p>
                </div>

                <div className="grid content-between gap-3">
                  <div className="flex h-10 items-center rounded-md border border-border">
                    <button
                      aria-label={`Diminuir quantidade de ${line.product.name}`}
                      className="grid size-10 place-items-center text-text-light hover:text-secondary"
                      onClick={() =>
                        updateQuantity(
                          line.product.id,
                          line.variant.id,
                          line.item.quantity - 1
                        )
                      }
                      type="button"
                    >
                      <Minus aria-hidden="true" size={16} />
                    </button>
                    <input
                      aria-label={`Quantidade de ${line.product.name}`}
                      className="h-10 w-14 border-x border-border text-center text-sm font-bold outline-none"
                      max={line.maxQuantity}
                      min={1}
                      onChange={(event) =>
                        updateQuantity(
                          line.product.id,
                          line.variant.id,
                          Number(event.target.value)
                        )
                      }
                      type="number"
                      value={line.item.quantity}
                    />
                    <button
                      aria-label={`Aumentar quantidade de ${line.product.name}`}
                      className="grid size-10 place-items-center text-text-light hover:text-secondary"
                      onClick={() =>
                        updateQuantity(
                          line.product.id,
                          line.variant.id,
                          line.item.quantity + 1
                        )
                      }
                      type="button"
                    >
                      <Plus aria-hidden="true" size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:grid sm:justify-items-end">
                    <p className="font-black text-secondary">
                      {formatMoney(line.total)}
                    </p>
                    <button
                      aria-label={`Remover ${line.product.name}`}
                      className="inline-grid size-9 place-items-center rounded-md border border-border text-danger hover:bg-danger/10"
                      onClick={() => removeItem(line.product.id, line.variant.id)}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="h-fit rounded-md border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-xl font-black text-secondary">Resumo</h2>
        <dl className="mt-5 grid gap-3 text-sm">
          <SummaryRow label="Itens" value={String(summary.itemCount)} />
          <SummaryRow label="Subtotal" value={formatMoney(summary.subtotal)} />
          <SummaryRow label="Entrega" value={formatMoney(summary.deliveryAmount)} />
          <SummaryRow label="Desconto" value={formatMoney(summary.discountAmount)} />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4 text-base font-black text-secondary">
            <dt>Total</dt>
            <dd>{formatMoney(summary.total)}</dd>
          </div>
        </dl>
        <Link
          className="mt-5 flex h-12 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover"
          to="/checkout"
        >
          Finalizar compra
        </Link>
        <Link
          className="mt-3 flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-bold text-secondary hover:border-primary"
          to="/catalogo"
        >
          Continuar comprando
        </Link>
      </aside>
    </section>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-text-light">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
