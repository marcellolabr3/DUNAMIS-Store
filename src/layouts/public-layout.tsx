import type { ReactNode } from 'react';

import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
