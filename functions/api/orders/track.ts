import { OrderTrackingRepository } from '../../repositories/order-tracking-repository';
import { OrderTrackingService } from '../../services/order-tracking-service';
import type { Env } from '../../types/bindings';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestGet(context: PagesFunctionContext) {
  const url = new URL(context.request.url);
  const orderNumber = url.searchParams.get('orderNumber');

  if (!orderNumber) {
    return errorResponse('Numero do pedido e obrigatorio.', 400);
  }

  const service = new OrderTrackingService(
    new OrderTrackingRepository(context.env.DB)
  );
  const order = await service.findByOrderNumber(orderNumber);

  if (!order) {
    return errorResponse('Pedido nao encontrado.', 404);
  }

  return jsonResponse({ order });
}
