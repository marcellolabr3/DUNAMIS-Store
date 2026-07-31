import { FormEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  trackOrder,
  trackOrderByToken
} from '../services/order-tracking-service';
import type { PublicOrderTracking } from '../types/order-tracking';
import { formatMoney } from '../utils/money';

export function OrderTrackingPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const [orderNumber, setOrderNumber] = useState('');
  const [lookupCode, setLookupCode] = useState('');
  const [order, setOrder] = useState<PublicOrderTracking>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const publicToken = token;

    async function loadOrderByToken() {
      setIsLoading(true);
      try {
        setOrder(await trackOrderByToken(publicToken));
      } catch {
        setError('Pedido nao encontrado.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrderByToken();
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    try {
      const trackedOrder = await trackOrder({ orderNumber, lookupCode });
      setOrder(trackedOrder);
    } catch {
      setOrder(undefined);
      setError('Pedido nao encontrado. Confira o numero e o codigo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-primary-hover">
          Acompanhamento
        </p>
        <h1 className="mt-2 text-3xl font-black text-secondary">
          Acompanhar pedido
        </h1>
        <p className="mt-2 max-w-2xl text-text-light">
          Consulte o status usando o numero do pedido e o codigo de consulta.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[24rem_1fr]">
        <form
          className="grid h-fit gap-4 rounded-md border border-border bg-surface p-5 shadow-sm"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-2 text-sm font-bold text-secondary">
            Numero do pedido
            <input
              className="h-11 rounded-md border border-border px-3 text-sm font-normal uppercase outline-none focus:border-primary"
              onChange={(event) => setOrderNumber(event.target.value.toUpperCase())}
              placeholder="DNS-2026-000123"
              required
              value={orderNumber}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-secondary">
            Codigo de consulta
            <input
              className="h-11 rounded-md border border-border px-3 text-sm font-normal uppercase outline-none focus:border-primary"
              maxLength={6}
              onChange={(event) => setLookupCode(event.target.value.toUpperCase())}
              placeholder="A7K4M2"
              required
              value={lookupCode}
            />
          </label>
          <button
            className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Consultando...' : 'Consultar pedido'}
          </button>
          {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        </form>

        <div>
          {order ? (
            <OrderTrackingDetails order={order} />
          ) : (
            <div className="rounded-md border border-border bg-surface p-8 text-text-light shadow-sm">
              Use os dados do pedido para visualizar o acompanhamento.
              <p className="mt-3 text-sm">
                Demo: `DNS-2026-000001` com codigo `A7K4M2`.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface OrderTrackingDetailsProps {
  order: PublicOrderTracking;
}

function OrderTrackingDetails({ order }: OrderTrackingDetailsProps) {
  return (
    <article className="grid gap-5 rounded-md border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-primary-hover">
            {order.orderNumber}
          </p>
          <h2 className="mt-1 text-2xl font-black text-secondary">
            {order.statusLabel}
          </h2>
          <p className="mt-2 text-sm text-text-light">
            Cliente: {order.customerName}
          </p>
        </div>
        <strong className="rounded bg-primary px-3 py-2 text-sm text-secondary">
          {formatMoney(order.total)}
        </strong>
      </div>

      <section className="grid gap-3">
        <h3 className="font-black text-secondary">Produtos</h3>
        {order.items.map((item) => (
          <div
            className="flex justify-between gap-4 border-b border-border pb-3 text-sm last:border-b-0"
            key={`${item.productName}-${item.variantName}`}
          >
            <span>
              {item.quantity}x {item.productName}
              {item.variantName ? ` - ${item.variantName}` : ''}
            </span>
            <strong>{formatMoney(item.total)}</strong>
          </div>
        ))}
      </section>

      <section className="grid gap-3">
        <h3 className="font-black text-secondary">Resumo</h3>
        <SummaryRow label="Subtotal" value={formatMoney(order.subtotal)} />
        <SummaryRow label="Entrega" value={formatMoney(order.deliveryAmount)} />
        <SummaryRow label="Desconto" value={formatMoney(order.discountAmount)} />
        <SummaryRow label="Total" value={formatMoney(order.total)} strong />
      </section>

      <section className="grid gap-3">
        <h3 className="font-black text-secondary">Historico</h3>
        <ol className="grid gap-3">
          {order.history.map((item) => (
            <li className="rounded-md bg-background p-3 text-sm" key={item.createdAt}>
              <p className="font-bold text-secondary">{item.statusLabel}</p>
              {item.note && <p className="mt-1 text-text-light">{item.note}</p>}
              <p className="mt-1 text-xs text-text-light">
                {formatDateTime(item.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  strong?: boolean;
}

function SummaryRow({ label, value, strong = false }: SummaryRowProps) {
  return (
    <div
      className={`flex justify-between gap-4 text-sm ${
        strong ? 'font-black text-secondary' : 'text-text-light'
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}
