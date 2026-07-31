import { OrderTrackingRepository } from '../../../repositories/order-tracking-repository';
import { OrderTrackingService } from '../../../services/order-tracking-service';
import type { Env } from '../../../types/bindings';
import { errorResponse, jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  params: {
    publicToken: string;
  };
}

export async function onRequestGet(context: PagesFunctionContext) {
  const service = new OrderTrackingService(
    new OrderTrackingRepository(context.env.DB)
  );
  const order = await service.findByPublicToken(context.params.publicToken);

  if (!order) {
    return errorResponse('Pedido nao encontrado.', 404);
  }

  return jsonResponse({ order });
}
