import { AdminProductRepository } from '../../repositories/admin-product-repository';
import { AdminProductService } from '../../services/admin-product-service';
import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function makeService(env: Env) {
  return new AdminProductService(new AdminProductRepository(env.DB));
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const url = new URL(context.request.url);
  const service = makeService(context.env);
  const result = await service.list({
    query: url.searchParams.get('busca') ?? undefined,
    categoryId: url.searchParams.get('categoria') ?? undefined
  });

  return jsonResponse(result);
}

export async function onRequestPost(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const body = await context.request.json();
    const product = await makeService(context.env).create(body);

    return jsonResponse({ product }, { status: 201 });
  } catch (error) {
    return errorResponse('Nao foi possivel criar o produto.', 400, getDetails(error));
  }
}

function getDetails(error: unknown) {
  return error instanceof Error ? error.message : error;
}
