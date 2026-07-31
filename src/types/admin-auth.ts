export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
  turnstileToken?: string;
}
