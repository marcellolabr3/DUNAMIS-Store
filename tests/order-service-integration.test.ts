import { OrderService } from '../functions/services/order-service';
import type { OrderRepository } from '../functions/repositories/order-repository';
import type { PaymentService } from '../functions/services/payments/payment-service';
import type { PaymentResult } from '../functions/services/payments/payment-types';
import type { CheckoutProductRow } from '../functions/types/order';

const checkoutProduct: CheckoutProductRow = {
  product_id: 'product-1',
  product_name: 'Camiseta Teste',
  product_sku: 'CAM-BASE',
  product_price: 7990,
  promotional_price: 6990,
  track_stock: 1,
  variant_id: 'variant-1',
  variant_name: 'G / Preta',
  variant_sku: 'CAM-G-PRETA',
  price_adjustment: 500,
  stock_quantity: 3
};

describe('OrderService integration behavior', () => {
  it('recalculates promotional price and variation adjustment on the server', async () => {
    const persisted: { subtotal?: number; total?: number } = {};
    const service = makeService({
      products: [checkoutProduct],
      persistOrder: async (input) => {
        persisted.subtotal = input.subtotal;
        persisted.total = input.total;

        return {
          orderNumber: input.orderNumber,
          lookupCode: input.lookupCode,
          publicToken: input.publicToken,
          total: input.total,
          status: 'PENDING_PAYMENT',
          payment: input.payment
        };
      }
    });

    const order = await service.createOrder({
      customer: {
        fullName: 'Cliente Teste',
        whatsapp: '11999999999'
      },
      deliveryMethod: 'pickup',
      items: [{ productId: 'product-1', variantId: 'variant-1', quantity: 2 }],
      idempotencyKey: 'idempotency-key-123'
    });

    expect(persisted.subtotal).toBe(14980);
    expect(order.total).toBe(14980);
  });

  it('rejects quantities above available stock', async () => {
    const service = makeService({ products: [checkoutProduct] });

    await expect(
      service.createOrder({
        customer: {
          fullName: 'Cliente Teste',
          whatsapp: '11999999999'
        },
        deliveryMethod: 'pickup',
        items: [{ productId: 'product-1', variantId: 'variant-1', quantity: 4 }],
        idempotencyKey: 'idempotency-key-456'
      })
    ).rejects.toThrow('Estoque insuficiente');
  });

  it('returns an existing order for repeated idempotency keys', async () => {
    const service = makeService({
      existingOrder: {
        orderNumber: 'DNS-2026-000001',
        lookupCode: 'ABC123',
        publicToken: 'token',
        total: 1000,
        status: 'PENDING_PAYMENT',
        payment: {
          method: 'pix',
          provider: 'manual_pix',
          pixPayload: 'payload',
          qrCodeDataUrl: 'qr',
          expiresAt: '2026-07-31T12:00:00.000Z'
        }
      }
    });

    await expect(
      service.createOrder({
        customer: {
          fullName: 'Cliente Teste',
          whatsapp: '11999999999'
        },
        deliveryMethod: 'pickup',
        items: [{ productId: 'product-1', variantId: 'variant-1', quantity: 1 }],
        idempotencyKey: 'idempotency-key-789'
      })
    ).resolves.toMatchObject({ orderNumber: 'DNS-2026-000001' });
  });
});

function makeService(options: {
  products?: CheckoutProductRow[];
  existingOrder?: Awaited<ReturnType<OrderRepository['findOrderByIdempotencyKey']>>;
  persistOrder?: OrderRepository['persistOrder'];
}) {
  const repository = {
    findOrderByIdempotencyKey: vi.fn().mockResolvedValue(options.existingOrder),
    getCheckoutProducts: vi
      .fn()
      .mockResolvedValue({ results: options.products ?? [] }),
    getNextOrderSequence: vi.fn().mockResolvedValue(1),
    persistOrder:
      options.persistOrder ??
      vi.fn().mockImplementation(async (input) => ({
        orderNumber: input.orderNumber,
        lookupCode: input.lookupCode,
        publicToken: input.publicToken,
        total: input.total,
        status: 'PENDING_PAYMENT',
        payment: input.payment
      }))
  } as unknown as OrderRepository;
  const payment = {
    createPayment: vi.fn().mockImplementation(async ({ orderNumber, total }) => {
      const result: PaymentResult = {
        method: 'pix',
        provider: 'manual_pix',
        providerReference: orderNumber,
        status: 'PENDING',
        amount: total,
        pixPayload: `pix-${orderNumber}`,
        qrCodeDataUrl: 'data:image/png;base64,qr',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };

      return result;
    })
  } as unknown as PaymentService;

  return new OrderService(repository, payment);
}
