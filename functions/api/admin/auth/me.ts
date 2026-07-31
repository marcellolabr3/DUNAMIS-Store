import { AdminAuthRepository } from '../../../repositories/admin-auth-repository';
import { AdminAuthService } from '../../../services/admin-auth-service';
import type { Env } from '../../../types/bindings';
import { errorResponse, jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestGet(context: PagesFunctionContext) {
  const service = new AdminAuthService(
    new AdminAuthRepository(context.env.DB),
    context.env.SESSION_SECRET
  );
  const admin = await service.getCurrentAdmin(context.request);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  return jsonResponse({ admin });
}
