import type {
  OrderTrackingHistoryRow,
  OrderTrackingItemRow,
  OrderTrackingRow
} from '../types/order-tracking';

export class OrderTrackingRepository {
  constructor(private readonly db: D1Database) {}

  findByOrderNumber(orderNumber: string) {
    return this.db
      .prepare(
        `SELECT
          o.id,
          o.order_number,
          o.lookup_code,
          o.status,
          o.payment_status,
          o.payment_method,
          o.delivery_method,
          o.subtotal,
          o.delivery_amount,
          o.discount_amount,
          o.total,
          o.created_at,
          o.pix_expiration_at,
          c.full_name AS customer_name
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        WHERE o.order_number = ?
        LIMIT 1`
      )
      .bind(orderNumber)
      .first<OrderTrackingRow>();
  }

  findByPublicToken(publicToken: string) {
    return this.db
      .prepare(
        `SELECT
          o.id,
          o.order_number,
          o.lookup_code,
          o.status,
          o.payment_status,
          o.payment_method,
          o.delivery_method,
          o.subtotal,
          o.delivery_amount,
          o.discount_amount,
          o.total,
          o.created_at,
          o.pix_expiration_at,
          c.full_name AS customer_name
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        WHERE o.public_token = ?
        LIMIT 1`
      )
      .bind(publicToken)
      .first<OrderTrackingRow>();
  }

  getItems(orderId: string) {
    return this.db
      .prepare(
        `SELECT product_name, variant_name, quantity, unit_price, total
        FROM order_items
        WHERE order_id = ?
        ORDER BY created_at ASC`
      )
      .bind(orderId)
      .all<OrderTrackingItemRow>();
  }

  getHistory(orderId: string) {
    return this.db
      .prepare(
        `SELECT new_status, note, created_at
        FROM order_status_history
        WHERE order_id = ?
        ORDER BY created_at ASC`
      )
      .bind(orderId)
      .all<OrderTrackingHistoryRow>();
  }
}
