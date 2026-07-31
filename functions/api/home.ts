import { CatalogRepository } from '../repositories/catalog-repository';
import { CatalogService } from '../services/catalog-service';
import type { Env } from '../types/bindings';
import { jsonResponse } from '../utils/http';

interface PagesFunctionContext {
  env: Env;
}

export async function onRequestGet(context: PagesFunctionContext) {
  const service = new CatalogService(new CatalogRepository(context.env.DB));
  const home = await service.getHome();

  return jsonResponse(home);
}
