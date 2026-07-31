import { AdminCategoryRepository } from '../../repositories/admin-category-repository';
import { AdminCategoryService } from '../../services/admin-category-service';
import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const service = new AdminCategoryService(
    new AdminCategoryRepository(context.env.DB)
  );
  const categories = await service.list();

  return jsonResponse({ categories });
}
