import type { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a className="text-lg font-bold tracking-wide" href="/">
            DUNAMIS STORE
          </a>
          <nav aria-label="Menu principal" className="text-sm font-medium">
            <a className="hover:text-primary-hover" href="/">
              Início
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-text-light">
          DUNAMIS STORE
        </div>
      </footer>
    </div>
  );
}
