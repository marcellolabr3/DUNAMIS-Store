import { OrderRepository } from '../repositories/order-repository';
import { OrderService } from '../services/order-service';
import type { Env } from '../types/bindings';
import { errorResponse, jsonResponse } from '../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const body = await context.request.json();
    const service = new OrderService(new OrderRepository(context.env.DB));
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
