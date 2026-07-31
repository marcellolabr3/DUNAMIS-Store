import { AdminAuthRepository } from '../../../repositories/admin-auth-repository';
import { AdminAuthService } from '../../../services/admin-auth-service';
import type { Env } from '../../../types/bindings';
import { jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
}

export async function onRequestPost(context: PagesFunctionContext) {
  const service = new AdminAuthService(
    new AdminAuthRepository(context.env.DB),
    context.env.SESSION_SECRET
  );

  return jsonResponse(
    { ok: true },
    {
      headers: {
        'set-cookie': service.logoutCookie()
      }
    }
  );
}
