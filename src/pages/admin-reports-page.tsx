import { type ReactNode, useEffect, useState } from 'react';
import { FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getAdminReports } from '../services/admin-report-service';
import type { AdminReportData } from '../types/admin-report';
import { formatMoney } from '../utils/money';

export function AdminReportsPage() {
  const [data, setData] = useState<AdminReportData>();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const reports = await getAdminReports();

        if (active) {
          setData(reports);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar os relatorios.'
          );
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className="text-sm font-semibold text-danger">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-text-light">Carregando relatorios...</p>;
  }

  return <ReportsContent data={data} title="Relatorios" />;
}

export function ReportsContent({
  data,
  title = 'Visao geral'
}: {
  data: AdminReportData;
  title?: string;
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary">{title}</h2>
          <p className="mt-2 text-sm text-text-light">
            Indicadores principais de pedidos, vendas e estoque.
          </p>
        </div>
        <a
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-bold text-white hover:bg-black"
          href="/api/admin/reports/orders.csv"
        >
          <FileDown aria-hidden="true" size={17} />
          Exportar CSV
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Aguardando pagamento" value={data.metrics.pendingPayment} />
        <Metric label="Comprovantes enviados" value={data.metrics.receiptSubmitted} />
        <Metric label="Pagamentos confirmados" value={data.metrics.paid} />
        <Metric label="Em preparacao" value={data.metrics.preparing} />
        <Metric label="Prontos" value={data.metrics.readyForPickup} />
        <Metric label="Vendas do dia" value={formatMoney(data.metrics.salesToday)} />
        <Metric label="Vendas do mes" value={formatMoney(data.metrics.salesMonth)} />
        <Metric label="Estoque baixo" value={data.lowStock.length} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Produtos com estoque baixo">
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-text-light">Nenhum produto em alerta.</p>
          ) : (
            <div className="space-y-3">
              {data.lowStock.map((item) => (
                <div
                  className="flex justify-between gap-3 border-b border-border pb-2 text-sm"
                  key={item.sku}
                >
                  <div>
                    <p className="font-semibold text-secondary">
                      {item.productName}
                    </p>
                    <p className="text-xs text-text-light">
                      {item.variantName} | {item.sku}
                    </p>
                  </div>
                  <p className="font-bold text-warning">{item.stockQuantity}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Pedidos recentes">
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-text-light">Nenhum pedido recente.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <div
                  className="flex justify-between gap-3 border-b border-border pb-2 text-sm"
                  key={order.orderNumber}
                >
                  <div>
                    <Link
                      className="font-semibold text-secondary hover:text-primary-hover"
                      to={`/admin/pedidos?pedido=${order.id}`}
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-text-light">
                      {order.customerName} | {order.statusLabel}
                    </p>
                  </div>
                  <p className="font-bold text-secondary">
                    {formatMoney(order.total)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-md border border-border bg-surface p-4 shadow-sm">
      <p className="text-sm font-medium text-text-light">{label}</p>
      <p className="mt-3 text-3xl font-bold text-secondary">{value}</p>
    </article>
  );
}

function Panel({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-md border border-border bg-surface p-4">
      <h3 className="mb-4 font-bold text-secondary">{title}</h3>
      {children}
    </article>
  );
}
