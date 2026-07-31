import { CatalogRepository } from '../repositories/catalog-repository';
import { CatalogService } from '../services/catalog-service';
import type { Env } from '../types/bindings';
import { jsonResponse } from '../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function makeService(env: Env) {
  return new CatalogService(new CatalogRepository(env.DB));
}

export async function onRequestGet(context: PagesFunctionContext) {
  const url = new URL(context.request.url);
  const service = makeService(context.env);
  const products = await service.getProducts({
    category: url.searchParams.get('categoria') ?? undefined,
    query: url.searchParams.get('busca') ?? undefined,
    sort: url.searchParams.get('ordem') ?? undefined
  });

  return jsonResponse({ products });
}
