import { OrderRepository } from '../repositories/order-repository';
import { StoreSettingsRepository } from '../repositories/store-settings-repository';
import { OrderService } from '../services/order-service';
import { ManualCardProvider } from '../services/payments/manual-card-provider';
import { ManualPixProvider } from '../services/payments/manual-pix-provider';
import { PaymentService } from '../services/payments/payment-service';
import type { Env } from '../types/bindings';
import { errorResponse, jsonResponse } from '../utils/http';
import { enforceRateLimit } from '../utils/rate-limit';
import { getClientIp } from '../utils/security';
import { verifyTurnstile } from '../utils/turnstile';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const body = (await context.request.json()) as Record<string, unknown>;
    const ipAddress = getClientIp(context.request);

    await enforceRateLimit({
      db: context.env.DB,
      scope: 'checkout',
      identifier: `${ipAddress}:${String(body.idempotencyKey ?? '')}`,
      limit: 8,
      windowSeconds: 600
    });
    await verifyTurnstile({
      token:
        typeof body.turnstileToken === 'string' ? body.turnstileToken : undefined,
      secret: context.env.TURNSTILE_SECRET_KEY,
      ipAddress
    });

    const settings = await new StoreSettingsRepository(context.env.DB).get();

    if (!settings.storeActive) {
      throw new Error('Loja indisponivel para novos pedidos.');
    }

    if (body.deliveryMethod === 'delivery' && !settings.allowDelivery) {
      throw new Error('Entrega indisponivel no momento.');
    }

    if (body.deliveryMethod === 'pickup' && !settings.allowPickup) {
      throw new Error('Retirada indisponivel no momento.');
    }

    const paymentProvider =
      body.paymentMethod === 'manual_card'
        ? new ManualCardProvider()
        : new ManualPixProvider(settings);
    const service = new OrderService(
      new OrderRepository(context.env.DB),
      new PaymentService(paymentProvider)
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
