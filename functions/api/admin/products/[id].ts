import { AdminProductRepository } from '../../../repositories/admin-product-repository';
import { AdminProductService } from '../../../services/admin-product-service';
import type { Env } from '../../../types/bindings';
import { requireAdmin } from '../../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
  params: {
    id: string;
  };
}

function makeService(env: Env) {
  return new AdminProductService(new AdminProductRepository(env.DB));
}

export async function onRequestPut(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const body = await context.request.json();
    const product = await makeService(context.env).update(context.params.id, body);

    if (!product) {
      return errorResponse('Produto nao encontrado.', 404);
    }

    return jsonResponse({ product });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel atualizar o produto.',
      400,
      getDetails(error)
    );
  }
}

export async function onRequestDelete(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const removed = await makeService(context.env).softDelete(context.params.id);

  if (!removed) {
    return errorResponse('Produto nao encontrado.', 404);
  }

  return jsonResponse({ ok: true });
}

function getDetails(error: unknown) {
  return error instanceof Error ? error.message : error;
}
