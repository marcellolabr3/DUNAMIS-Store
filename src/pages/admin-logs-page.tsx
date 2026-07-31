import { FileClock } from 'lucide-react';

export function AdminLogsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Logs</h2>
        <p className="mt-2 text-sm text-text-light">
          Registro de eventos administrativos e auditoria.
        </p>
      </div>

      <div className="rounded-md border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <FileClock
            aria-hidden="true"
            className="mt-1 text-primary-hover"
            size={22}
          />
          <div>
            <h3 className="font-bold text-secondary">Auditoria registrada</h3>
            <p className="mt-1 text-sm text-text-light">
              Eventos criticos, como login e alteracoes de pedido, ficam salvos
              para consulta administrativa. A listagem detalhada sera conectada
              aos registros de auditoria em uma proxima etapa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
