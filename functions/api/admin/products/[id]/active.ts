import { z } from 'zod';

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

const schema = z.object({
  active: z.coerce.boolean()
});

export async function onRequestPatch(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const body = schema.parse(await context.request.json());
  const service = new AdminProductService(
    new AdminProductRepository(context.env.DB)
  );
  const product = await service.setActive(context.params.id, body.active);

  if (!product) {
    return errorResponse('Produto nao encontrado.', 404);
  }

  return jsonResponse({ product });
}
