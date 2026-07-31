import { AdminAuthRepository } from '../repositories/admin-auth-repository';
import { AdminAuthService } from '../services/admin-auth-service';
import type { Env } from '../types/bindings';

export async function requireAdmin(request: Request, env: Env) {
  const authService = new AdminAuthService(
    new AdminAuthRepository(env.DB),
    env.SESSION_SECRET
  );
  const admin = await authService.getCurrentAdmin(request);

  if (!admin) {
    return undefined;
  }

  return admin;
}
