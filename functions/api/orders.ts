import { OrderRepository } from '../repositories/order-repository';
import { StoreSettingsRepository } from '../repositories/store-settings-repository';
import { OrderService } from '../services/order-service';
import { ManualPixProvider } from '../services/payments/manual-pix-provider';
import { PaymentService } from '../services/payments/payment-service';
import type { Env } from '../types/bindings';
import { errorResponse, jsonResponse } from '../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const body = await context.request.json();
    const settings = await new StoreSettingsRepository(context.env.DB).get();
    const service = new OrderService(
      new OrderRepository(context.env.DB),
      new PaymentService(new ManualPixProvider(settings))
    );
    const order = await service.createOrder(body);

    return jsonResponse({ order }, { status: 201 });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel criar o pedido.',
      422,
      error instanceof Error ? error.message : undefined
    );
  }
}
