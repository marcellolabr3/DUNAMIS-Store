import { useEffect, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Boxes,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  ListTree,
  Package,
  Settings,
  ShieldCheck,
  Users
} from 'lucide-react';
import { NavLink, useHistory } from 'react-router-dom';

import { useAdminAuth } from '../hooks/use-admin-auth';
import { logoutAdmin } from '../services/admin-auth-service';
import {
  type PublicStoreSettings,
  getPublicSettings
} from '../services/public-settings-service';
import { SiteLogo } from '../components/site-logo';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminItems = [
  { label: 'Visao geral', icon: LayoutDashboard, to: '/admin' },
  { label: 'Pedidos', icon: FileText, to: '/admin/pedidos' },
  { label: 'Produtos', icon: Package, to: '/admin/produtos' },
  { label: 'Categorias', icon: ListTree, to: '/admin/categorias' },
  { label: 'Estoque', icon: Boxes, to: '/admin/estoque' },
  { label: 'Banners', icon: Image, to: '/admin/banners' },
  { label: 'Configuracoes', icon: Settings, to: '/admin/configuracoes' },
  { label: 'Relatorios', icon: BarChart3, to: '/admin/relatorios' },
  { label: 'Administradores', icon: Users, to: '/admin/administradores' },
  { label: 'Logs', icon: ShieldCheck, to: '/admin/logs' }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const history = useHistory();
  const { admin, setAdmin } = useAdminAuth();
  const [settings, setSettings] = useState<PublicStoreSettings>();

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const loadedSettings = await getPublicSettings();

        if (active) {
          setSettings(loadedSettings);
        }
      } catch {
        if (active) {
          setSettings(undefined);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await logoutAdmin();
    setAdmin(undefined);
    history.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-admin text-text lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-border bg-surface lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4">
          <SiteLogo
            compact
            logoUrl={settings?.logoUrl}
            storeName={settings?.storeName}
          />
          <NavLink
            aria-label="Voltar para loja"
            className="inline-grid size-10 place-items-center rounded-md border border-border text-text-light hover:text-secondary"
            to="/"
          >
            <Home aria-hidden="true" size={18} />
          </NavLink>
        </div>
        <nav
          aria-label="Menu administrativo"
          className="flex gap-2 overflow-x-auto px-3 pb-3 lg:grid lg:overflow-visible lg:py-4"
        >
          {adminItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                activeClassName="bg-primary text-secondary"
                className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-text-light transition hover:bg-primary/20 hover:text-secondary"
                exact={item.to === '/admin'}
                key={item.to}
                to={item.to}
              >
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0">
        <div className="border-b border-border bg-surface px-4 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-primary-hover">
                Painel administrativo
              </p>
              <h1 className="mt-1 text-2xl font-bold text-secondary">
                {settings?.storeName || 'DUNAMIS STORE'}
              </h1>
              {admin && (
                <p className="mt-1 text-sm text-text-light">{admin.email}</p>
              )}
            </div>
            <button
              className="rounded-md border border-border px-4 py-2 text-sm font-bold text-secondary hover:border-primary"
              onClick={handleLogout}
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
