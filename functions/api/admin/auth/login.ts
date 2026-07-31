import { AdminAuthRepository } from '../../../repositories/admin-auth-repository';
import { AdminAuthService } from '../../../services/admin-auth-service';
import type { Env } from '../../../types/bindings';
import { errorResponse, jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const body = await context.request.json();
    const service = new AdminAuthService(
      new AdminAuthRepository(context.env.DB),
      context.env.SESSION_SECRET
    );
    const result = await service.login(body);

    return jsonResponse(
      { admin: result.admin },
      {
        headers: {
          'set-cookie': result.cookie
        }
      }
    );
  } catch (error) {
    return errorResponse(
      'Nao foi possivel autenticar.',
      401,
      error instanceof Error ? error.message : undefined
    );
  }
}
