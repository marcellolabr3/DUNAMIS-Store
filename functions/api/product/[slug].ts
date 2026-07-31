import { CatalogRepository } from '../../repositories/catalog-repository';
import { CatalogService } from '../../services/catalog-service';
import type { Env } from '../../types/bindings';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  params: {
    slug: string;
  };
}

export async function onRequestGet(context: PagesFunctionContext) {
  const service = new CatalogService(new CatalogRepository(context.env.DB));
  const product = await service.getProduct(context.params.slug);

  if (!product) {
    return errorResponse('Produto nao encontrado.', 404);
  }

  return jsonResponse({ product });
}
