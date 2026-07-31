import { type ReactNode, useEffect, useState } from 'react';

import { AdminAuthContext } from './admin-auth-context';
import { getCurrentAdmin } from '../services/admin-auth-service';
import type { AdminUser } from '../types/admin-auth';

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [admin, setAdmin] = useState<AdminUser>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAdmin() {
      const currentAdmin = await getCurrentAdmin();

      if (mounted) {
        setAdmin(currentAdmin);
        setIsLoading(false);
      }
    }

    void loadAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
