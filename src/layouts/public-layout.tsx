import type { ReactNode } from 'react';

import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
