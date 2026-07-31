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
  const lookupCode = url.searchParams.get('lookupCode');

  if (!orderNumber || !lookupCode) {
    return errorResponse('Numero do pedido e codigo sao obrigatorios.', 400);
  }

  const service = new OrderTrackingService(
    new OrderTrackingRepository(context.env.DB)
  );
  const order = await service.findByNumberAndLookupCode({
    orderNumber,
    lookupCode
  });

  if (!order) {
    return errorResponse('Pedido nao encontrado.', 404);
  }

  return jsonResponse({ order });
}
