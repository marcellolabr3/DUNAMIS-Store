import { AdminProductRepository } from '../../../../repositories/admin-product-repository';
import { AdminProductService } from '../../../../services/admin-product-service';
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

export async function onRequestPost(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const service = new AdminProductService(
      new AdminProductRepository(context.env.DB)
    );
    const product = await service.duplicate(context.params.id);

    if (!product) {
      return errorResponse('Produto nao encontrado.', 404);
    }

    return jsonResponse({ product }, { status: 201 });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel duplicar o produto.',
      400,
      error instanceof Error ? error.message : error
    );
  }
}
