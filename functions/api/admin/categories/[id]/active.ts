import { AdminCategoryRepository } from '../../../../repositories/admin-category-repository';
import { AdminCategoryService } from '../../../../services/admin-category-service';
import type { Env } from '../../../../types/bindings';
import { requireAdmin } from '../../../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
  params: {
    id: string;
  };
}

export async function onRequestPatch(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const body = (await context.request.json()) as { active?: unknown };

    if (typeof body.active !== 'boolean') {
      return errorResponse('Status invalido.', 400);
    }

    const service = new AdminCategoryService(
      new AdminCategoryRepository(context.env.DB)
    );
    const category = await service.setActive(context.params.id, body.active);

    if (!category) {
      return errorResponse('Categoria nao encontrada.', 404);
    }

    return jsonResponse({ category });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel alterar a categoria.',
      400,
      error instanceof Error ? error.message : undefined
    );
  }
}
