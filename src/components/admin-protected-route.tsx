import type { ReactNode } from 'react';
import { Redirect } from 'react-router-dom';

import { useAdminAuth } from '../hooks/use-admin-auth';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <section className="grid min-h-screen place-items-center bg-admin text-text-light">
        Carregando painel...
      </section>
    );
  }

  if (!admin) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
