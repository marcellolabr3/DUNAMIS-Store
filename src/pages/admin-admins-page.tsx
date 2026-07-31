import { ShieldCheck, UserPlus } from 'lucide-react';

export function AdminAdminsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Administradores</h2>
        <p className="mt-2 text-sm text-text-light">
          Controle de acesso administrativo da DUNAMIS STORE.
        </p>
      </div>

      <div className="rounded-md border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            aria-hidden="true"
            className="mt-1 text-primary-hover"
            size={22}
          />
          <div>
            <h3 className="font-bold text-secondary">Administrador inicial</h3>
            <p className="mt-1 text-sm text-text-light">
              O administrador demo ja esta ativo. Novos administradores devem ser
              criados com hash de senha e sessao segura antes de liberar para uso
              real.
            </p>
          </div>
        </div>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-bold text-text-light"
        disabled
        type="button"
      >
        <UserPlus aria-hidden="true" size={17} />
        Novo administrador
      </button>
    </section>
  );
}
