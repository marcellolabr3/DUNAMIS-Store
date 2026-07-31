import { AdminOrderRepository } from '../../../repositories/admin-order-repository';
import { AdminOrderService } from '../../../services/admin-order-service';
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

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const service = new AdminOrderService(new AdminOrderRepository(context.env.DB));
  const order = await service.details(context.params.id);

  if (!order) {
    return errorResponse('Pedido nao encontrado.', 404);
  }

  return jsonResponse({ order });
}
