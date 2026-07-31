import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileDown,
  Printer,
  Search,
  ShieldCheck,
  XCircle
} from 'lucide-react';

import {
  getAdminOrder,
  getAdminOrders,
  updateAdminOrderPayment,
  updateAdminOrderStatus
} from '../services/admin-order-service';
import {
  type AdminOrderDetails,
  type AdminOrderSummary,
  adminOrderStatuses
} from '../types/admin-order';
import { formatMoney } from '../utils/money';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetails>();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getAdminOrders({ query, status, dateFrom, dateTo });

        if (!active) {
          return;
        }

        setOrders(data.orders);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar os pedidos.'
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [dateFrom, dateTo, query, status]);

  const stats = useMemo(
    () => ({
      waiting: orders.filter((order) => order.status === 'PENDING_PAYMENT').length,
      receipts: orders.filter((order) => order.status === 'RECEIPT_SUBMITTED')
        .length,
      paid: orders.filter((order) => order.status === 'PAID').length,
      total: orders.reduce((sum, order) => sum + order.total, 0)
    }),
    [orders]
  );

  async function reloadOrders() {
    const data = await getAdminOrders({ query, status, dateFrom, dateTo });
    setOrders(data.orders);
  }

  async function selectOrder(id: string) {
    setError('');
    const data = await getAdminOrder(id);
    setSelectedOrder(data.order);
    setNote('');
  }

  async function handlePayment(action: 'review' | 'confirm' | 'reject') {
    if (!selectedOrder) {
      return;
    }

    setIsUpdating(true);
    setMessage('');
    setError('');

    try {
      const data = await updateAdminOrderPayment(selectedOrder.id, action, note);
      setSelectedOrder(data.order);
      await reloadOrders();
      setMessage('Pagamento atualizado.');
      setNote('');
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Nao foi possivel atualizar o pagamento.'
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleStatusChange(nextStatus: string) {
    if (!selectedOrder) {
      return;
    }

    setIsUpdating(true);
    setMessage('');
    setError('');

    try {
      const data = await updateAdminOrderStatus(selectedOrder.id, nextStatus, note);
      setSelectedOrder(data.order);
      await reloadOrders();
      setMessage('Status atualizado.');
      setNote('');
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Nao foi possivel atualizar o status.'
      );
    } finally {
      setIsUpdating(false);
    }
  }

  function exportCsv() {
    const rows = [
      ['pedido', 'cliente', 'status', 'recebimento', 'total', 'criado_em'],
      ...orders.map((order) => [
        order.orderNumber,
        order.customerName,
        order.statusLabel,
        order.deliveryMethod,
        (order.total / 100).toFixed(2),
        order.createdAt
      ])
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    );
    const link = document.createElement('a');

    link.href = url;
    link.download = 'pedidos-dunamis-store.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary">Pedidos</h2>
          <p className="mt-2 text-sm text-text-light">
            Confira comprovantes, confirme pagamentos e acompanhe cada status.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-bold text-secondary hover:border-primary"
            onClick={() => window.print()}
            type="button"
          >
            <Printer aria-hidden="true" size={17} />
            Imprimir
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-bold text-white hover:bg-black"
            onClick={exportCsv}
            type="button"
          >
            <FileDown aria-hidden="true" size={17} />
            CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Aguardando" value={stats.waiting} />
        <Metric label="Comprovantes" value={stats.receipts} />
        <Metric label="Pagos" value={stats.paid} />
        <Metric label="Total filtrado" value={formatMoney(stats.total)} />
      </div>

      {(message || error) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            error
              ? 'border-danger/30 bg-danger/10 text-danger'
              : 'border-success/30 bg-success/10 text-success'
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="space-y-4">
          <div className="grid gap-3 rounded-md border border-border bg-surface p-4 md:grid-cols-[1fr_12rem_10rem_10rem]">
            <label className="relative block">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
                size={17}
              />
              <span className="sr-only">Buscar pedido</span>
              <input
                className="input pl-10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pedido, cliente ou WhatsApp"
                value={query}
              />
            </label>
            <select
              className="input"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              <option value="">Todos os status</option>
              {adminOrderStatuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className="input"
              onChange={(event) => setDateFrom(event.target.value)}
              type="date"
              value={dateFrom}
            />
            <input
              className="input"
              onChange={(event) => setDateTo(event.target.value)}
              type="date"
              value={dateTo}
            />
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-surface">
            {isLoading ? (
              <p className="p-6 text-sm text-text-light">Carregando pedidos...</p>
            ) : orders.length === 0 ? (
              <p className="p-6 text-sm text-text-light">
                Nenhum pedido encontrado.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-text-light">
                    <tr>
                      <th className="px-4 py-3">Pedido</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr
                        className={
                          selectedOrder?.id === order.id ? 'bg-primary/10' : ''
                        }
                        key={order.id}
                      >
                        <td className="px-4 py-3">
                          <button
                            className="font-bold text-secondary hover:text-primary-hover"
                            onClick={() => void selectOrder(order.id)}
                            type="button"
                          >
                            {order.orderNumber}
                          </button>
                          <p className="mt-1 text-xs text-text-light">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-secondary">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-text-light">
                            {order.customerWhatsapp}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge label={order.statusLabel} status={order.status} />
                        </td>
                        <td className="px-4 py-3 font-semibold text-secondary">
                          {formatMoney(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {selectedOrder ? (
          <OrderDetails
            isUpdating={isUpdating}
            note={note}
            onNoteChange={setNote}
            onPayment={handlePayment}
            onStatusChange={handleStatusChange}
            order={selectedOrder}
          />
        ) : (
          <div className="rounded-md border border-border bg-surface p-6 text-sm text-text-light">
            Selecione um pedido para visualizar detalhes.
          </div>
        )}
      </div>
    </section>
  );
}

function OrderDetails({
  isUpdating,
  note,
  onNoteChange,
  onPayment,
  onStatusChange,
  order
}: {
  isUpdating: boolean;
  note: string;
  onNoteChange: (note: string) => void;
  onPayment: (action: 'review' | 'confirm' | 'reject') => Promise<void>;
  onStatusChange: (status: string) => Promise<void>;
  order: AdminOrderDetails;
}) {
  return (
    <aside className="space-y-5 rounded-md border border-border bg-surface p-4">
      <div>
        <p className="text-xs font-bold uppercase text-primary-hover">
          {order.orderNumber}
        </p>
        <h3 className="mt-1 text-lg font-bold text-secondary">
          {order.customer.name}
        </h3>
        <p className="mt-1 text-sm text-text-light">
          {order.customer.whatsapp}
          {order.customer.email ? ` | ${order.customer.email}` : ''}
        </p>
      </div>

      <StatusBadge label={order.statusLabel} status={order.status} />

      <div className="grid gap-2 text-sm">
        {order.items.map((item) => (
          <div
            className="flex justify-between gap-3 border-b border-border pb-2"
            key={`${item.sku}-${item.productName}`}
          >
            <div>
              <p className="font-semibold text-secondary">{item.productName}</p>
              <p className="text-xs text-text-light">
                {item.variantName || 'Sem variacao'} | {item.quantity} un.
              </p>
            </div>
            <p className="font-semibold text-secondary">{formatMoney(item.total)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-sm">
        <Line label="Subtotal" value={formatMoney(order.subtotal)} />
        <Line label="Entrega" value={formatMoney(order.deliveryAmount)} />
        <Line label="Desconto" value={formatMoney(order.discountAmount)} />
        <Line label="Total" value={formatMoney(order.total)} strong />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-secondary">Comprovantes</h4>
        {order.receipts.length === 0 ? (
          <p className="text-sm text-text-light">Nenhum comprovante enviado.</p>
        ) : (
          order.receipts.map((receipt) => (
            <a
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm hover:border-primary"
              href={receipt.downloadUrl}
              key={receipt.id}
              rel="noreferrer"
              target="_blank"
            >
              <span>
                <span className="block font-semibold text-secondary">
                  {receipt.fileName}
                </span>
                <span className="text-xs text-text-light">
                  {formatDate(receipt.uploadedAt)}
                </span>
              </span>
              <Download aria-hidden="true" size={17} />
            </a>
          ))
        )}
      </div>

      <div className="space-y-2">
        <label className="grid gap-1 text-sm font-semibold text-secondary">
          Observacao da alteracao
          <textarea
            className="input min-h-20"
            onChange={(event) => onNoteChange(event.target.value)}
            value={note}
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          <ActionButton
            disabled={isUpdating}
            icon={<ShieldCheck aria-hidden="true" size={16} />}
            label="Analise"
            onClick={() => void onPayment('review')}
          />
          <ActionButton
            disabled={isUpdating}
            icon={<CheckCircle2 aria-hidden="true" size={16} />}
            label="Confirmar"
            onClick={() => void onPayment('confirm')}
          />
          <ActionButton
            disabled={isUpdating}
            icon={<XCircle aria-hidden="true" size={16} />}
            label="Rejeitar"
            onClick={() => void onPayment('reject')}
          />
        </div>
      </div>

      <label className="grid gap-1 text-sm font-semibold text-secondary">
        Atualizar status
        <select
          className="input"
          disabled={isUpdating}
          onChange={(event) => void onStatusChange(event.target.value)}
          value={order.status}
        >
          {adminOrderStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <h4 className="text-sm font-bold text-secondary">Historico</h4>
        {order.history.map((item) => (
          <div className="rounded-md bg-background p-3 text-sm" key={item.createdAt}>
            <p className="font-semibold text-secondary">{item.statusLabel}</p>
            <p className="text-xs text-text-light">
              {formatDate(item.createdAt)}
              {item.adminName ? ` | ${item.adminName}` : ''}
            </p>
            {item.note && <p className="mt-1 text-text-light">{item.note}</p>}
          </div>
        ))}
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-md border border-border bg-surface p-4">
      <p className="text-sm text-text-light">{label}</p>
      <p className="mt-2 text-2xl font-bold text-secondary">{value}</p>
    </article>
  );
}

function StatusBadge({ label, status }: { label: string; status: string }) {
  const paid = ['PAID', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'].includes(
    status
  );
  const warning = ['RECEIPT_SUBMITTED', 'PAYMENT_REVIEW'].includes(status);

  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-xs font-bold ${
        paid
          ? 'bg-success/10 text-success'
          : warning
            ? 'bg-warning/10 text-warning'
            : 'bg-background text-text-light'
      }`}
    >
      {label}
    </span>
  );
}

function Line({
  label,
  strong,
  value
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div
      className={`flex justify-between gap-3 ${
        strong ? 'text-base font-bold text-secondary' : 'text-text-light'
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ActionButton({
  disabled,
  icon,
  label,
  onClick
}: {
  disabled: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-bold text-secondary hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}
