import type { AdminLoginInput, AdminUser } from '../types/admin-auth';

export async function loginAdmin(input: AdminLoginInput): Promise<AdminUser> {
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Credenciais invalidas.');
  }

  const payload = (await response.json()) as { admin: AdminUser };

  return payload.admin;
}

export async function getCurrentAdmin(): Promise<AdminUser | undefined> {
  try {
    const response = await fetch('/api/admin/auth/me');

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as { admin: AdminUser };

    return payload.admin;
  } catch {
    return undefined;
  }
}

export async function logoutAdmin() {
  await fetch('/api/admin/auth/logout', {
    method: 'POST'
  });
}
