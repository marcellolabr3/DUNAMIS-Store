import { OrderTrackingRepository } from '../repositories/order-tracking-repository';
import { getOrderStatusLabel } from './order-status';
import type {
  OrderTrackingRow,
  PublicOrderTracking
} from '../types/order-tracking';

export class OrderTrackingService {
  constructor(private readonly repository: OrderTrackingRepository) {}

  async findByNumberAndLookupCode(input: {
    orderNumber: string;
    lookupCode: string;
  }) {
    const order = await this.repository.findByNumberAndLookupCode(
      input.orderNumber.trim().toUpperCase(),
      input.lookupCode.trim().toUpperCase()
    );

    return order ? this.buildTracking(order) : undefined;
  }

  async findByPublicToken(publicToken: string) {
    const order = await this.repository.findByPublicToken(publicToken);

    return order ? this.buildTracking(order) : undefined;
  }

  private async buildTracking(
    order: OrderTrackingRow
  ): Promise<PublicOrderTracking> {
    const [items, history] = await Promise.all([
      this.repository.getItems(order.id),
      this.repository.getHistory(order.id)
    ]);

    return {
      orderNumber: order.order_number,
      status: order.status,
      statusLabel: getOrderStatusLabel(order.status),
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      deliveryMethod: order.delivery_method,
      subtotal: order.subtotal,
      deliveryAmount: order.delivery_amount,
      discountAmount: order.discount_amount,
      total: order.total,
      createdAt: order.created_at,
      pixExpirationAt: order.pix_expiration_at ?? undefined,
      customerName: maskCustomerName(order.customer_name),
      items: items.results.map((item) => ({
        productName: item.product_name,
        variantName: item.variant_name ?? undefined,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total
      })),
      history: history.results.map((item) => ({
        status: item.new_status,
        statusLabel: getOrderStatusLabel(item.new_status),
        note: item.note ?? undefined,
        createdAt: item.created_at
      }))
    };
  }
}

function maskCustomerName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/);

  return firstName ? `${firstName} ***` : 'Cliente';
}
