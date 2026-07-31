import { useState } from 'react';
import { Menu, ShoppingCart } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import { useCart } from '../hooks/use-cart';
import { SiteLogo } from './site-logo';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Catalogo', to: '/catalogo' },
  { label: 'Acompanhar pedido', to: '/pedido' }
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { summary } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <SiteLogo />

        <nav
          aria-label="Menu principal"
          className="hidden items-center gap-6 text-sm font-semibold text-text-light md:flex"
        >
          {navItems.map((item) => (
            <NavLink
              activeClassName="text-secondary"
              className="transition hover:text-secondary"
              exact={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            aria-label="Abrir carrinho"
            className="relative inline-grid size-10 place-items-center rounded-md border border-border bg-surface text-secondary transition hover:border-primary hover:bg-primary/10"
            to="/carrinho"
          >
            <ShoppingCart aria-hidden="true" size={20} />
            {summary.itemCount > 0 && (
              <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-black text-secondary ring-2 ring-surface">
                {summary.itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Abrir menu"
            className="inline-grid size-10 place-items-center rounded-md border border-border bg-surface text-secondary md:hidden"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <Menu aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav
          aria-label="Menu principal mobile"
          className="grid gap-1 border-t border-border bg-surface px-4 py-3 text-sm font-semibold text-text-light md:hidden"
        >
          {navItems.map((item) => (
            <NavLink
              activeClassName="bg-primary/20 text-secondary"
              className="rounded-md px-3 py-2"
              exact={item.to === '/'}
              key={item.to}
              onClick={() => setMobileMenuOpen(false)}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
