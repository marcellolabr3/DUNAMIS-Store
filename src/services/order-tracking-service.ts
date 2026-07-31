import type { PublicOrderTracking } from '../types/order-tracking';

const demoOrders: PublicOrderTracking[] = [
  {
    orderNumber: 'DNS-2026-000001',
    status: 'PENDING_PAYMENT',
    statusLabel: 'Aguardando pagamento',
    paymentStatus: 'PENDING',
    paymentMethod: 'manual_pix',
    deliveryMethod: 'pickup',
    subtotal: 6990,
    deliveryAmount: 0,
    discountAmount: 0,
    total: 6990,
    createdAt: '2026-07-31T12:00:00.000Z',
    pixExpirationAt: '2026-08-01T12:00:00.000Z',
    customerName: 'Ana ***',
    items: [
      {
        productName: 'Camiseta Dunamis Classica',
        variantName: 'M / Preta',
        quantity: 1,
        unitPrice: 6990,
        total: 6990
      }
    ],
    history: [
      {
        status: 'PENDING_PAYMENT',
        statusLabel: 'Aguardando pagamento',
        note: 'Pedido de demonstracao criado.',
        createdAt: '2026-07-31T12:00:00.000Z'
      }
    ]
  },
  {
    orderNumber: 'DNS-2026-000002',
    status: 'RECEIPT_SUBMITTED',
    statusLabel: 'Comprovante enviado',
    paymentStatus: 'RECEIPT_SUBMITTED',
    paymentMethod: 'manual_pix',
    deliveryMethod: 'pickup',
    subtotal: 3990,
    deliveryAmount: 0,
    discountAmount: 0,
    total: 3990,
    createdAt: '2026-07-31T12:00:00.000Z',
    customerName: 'Bruno ***',
    items: [
      {
        productName: 'Devocional 30 Dias',
        variantName: 'Unico',
        quantity: 1,
        unitPrice: 3990,
        total: 3990
      }
    ],
    history: [
      {
        status: 'PENDING_PAYMENT',
        statusLabel: 'Aguardando pagamento',
        note: 'Pedido de demonstracao criado.',
        createdAt: '2026-07-31T12:00:00.000Z'
      },
      {
        status: 'RECEIPT_SUBMITTED',
        statusLabel: 'Comprovante enviado',
        note: 'Comprovante ficticio enviado.',
        createdAt: '2026-07-31T12:10:00.000Z'
      }
    ]
  }
];

const demoLookupCodes: Record<string, string> = {
  'DNS-2026-000001': 'A7K4M2',
  'DNS-2026-000002': 'B8L5N3'
};

export async function trackOrder(input: {
  orderNumber: string;
  lookupCode: string;
}): Promise<PublicOrderTracking> {
  const params = new URLSearchParams({
    orderNumber: input.orderNumber,
    lookupCode: input.lookupCode
  });

  try {
    const response = await fetch(`/api/orders/track?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Pedido nao encontrado.');
    }

    const payload = (await response.json()) as { order: PublicOrderTracking };

    return payload.order;
  } catch {
    const demoOrder = demoOrders.find(
      (order) =>
        order.orderNumber === input.orderNumber.trim().toUpperCase() &&
        demoLookupCodes[order.orderNumber] === input.lookupCode.trim().toUpperCase()
    );

    if (!demoOrder) {
      throw new Error('Pedido nao encontrado.');
    }

    return demoOrder;
  }
}

export async function trackOrderByToken(
  publicToken: string
): Promise<PublicOrderTracking> {
  const response = await fetch(`/api/orders/token/${publicToken}`);

  if (!response.ok) {
    throw new Error('Pedido nao encontrado.');
  }

  const payload = (await response.json()) as { order: PublicOrderTracking };

  return payload.order;
}
