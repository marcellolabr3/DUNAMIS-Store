export interface AdminSession {
  adminId: string;
  email: string;
  role: string;
  expiresAt: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  active: number;
  failed_login_attempts: number;
  locked_until: string | null;
}
