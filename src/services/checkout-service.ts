import type { CheckoutDraft, CreatedOrder } from '../types/checkout';

export async function createCheckoutOrder(
  draft: CheckoutDraft
): Promise<CreatedOrder> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(draft)
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel criar o pedido.');
  }

  const payload = (await response.json()) as { order: CreatedOrder };

  return payload.order;
}
