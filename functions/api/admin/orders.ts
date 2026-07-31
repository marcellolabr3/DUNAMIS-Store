import { AdminOrderRepository } from '../../repositories/admin-order-repository';
import { AdminOrderService } from '../../services/admin-order-service';
import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function makeService(env: Env) {
  return new AdminOrderService(new AdminOrderRepository(env.DB));
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const url = new URL(context.request.url);
  const orders = await makeService(context.env).list({
    query: url.searchParams.get('busca') ?? undefined,
    status: url.searchParams.get('status') ?? undefined,
    dateFrom: url.searchParams.get('de') ?? undefined,
    dateTo: url.searchParams.get('ate') ?? undefined
  });

  return jsonResponse({ orders });
}
