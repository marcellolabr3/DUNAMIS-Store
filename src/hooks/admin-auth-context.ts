import { createContext } from 'react';

import type { AdminUser } from '../types/admin-auth';

export interface AdminAuthContextValue {
  admin?: AdminUser;
  isLoading: boolean;
  setAdmin: (admin?: AdminUser) => void;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);
