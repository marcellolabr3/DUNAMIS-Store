import type {
  AdminOrderAddressRow,
  AdminOrderHistoryRow,
  AdminOrderItemRow,
  AdminOrderPaymentRow,
  AdminOrderReceiptRow,
  AdminOrderRow
} from '../types/admin-order';

export class AdminOrderRepository {
  constructor(private readonly db: D1Database) {}

  getOrders(filters: {
    query?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const conditions = ['1 = 1'];
    const bindings: string[] = [];

    if (filters.query) {
      conditions.push('(o.order_number LIKE ? OR c.full_name LIKE ? OR c.whatsapp LIKE ?)');
      bindings.push(
        `%${filters.query}%`,
        `%${filters.query}%`,
        `%${filters.query}%`
      );
    }

    if (filters.status) {
      conditions.push('o.status = ?');
      bindings.push(filters.status);
    }

    if (filters.dateFrom) {
      conditions.push('date(o.created_at) >= date(?)');
      bindings.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('date(o.created_at) <= date(?)');
      bindings.push(filters.dateTo);
    }

    return this.db
      .prepare(
        `SELECT
          o.id,
          o.order_number,
          o.status,
          o.payment_status,
          o.payment_method,
          o.delivery_method,
          o.subtotal,
          o.delivery_amount,
          o.discount_amount,
          o.total,
          o.customer_notes,
          o.internal_notes,
          o.created_at,
          o.updated_at,
          c.full_name AS customer_name,
          c.whatsapp AS customer_whatsapp,
          c.email AS customer_email
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY o.created_at DESC
        LIMIT 100`
      )
      .bind(...bindings)
      .all<AdminOrderRow>();
  }

  getOrder(id: string) {
    return this.db
      .prepare(
        `SELECT
          o.id,
          o.order_number,
          o.status,
          o.payment_status,
          o.payment_method,
          o.delivery_method,
          o.subtotal,
          o.delivery_amount,
          o.discount_amount,
          o.total,
          o.customer_notes,
          o.internal_notes,
          o.created_at,
          o.updated_at,
          c.full_name AS customer_name,
          c.whatsapp AS customer_whatsapp,
          c.email AS customer_email
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        WHERE o.id = ?
        LIMIT 1`
      )
      .bind(id)
      .first<AdminOrderRow>();
  }

  getItems(orderId: string) {
    return this.db
      .prepare(
        `SELECT product_name, variant_name, sku, unit_price, quantity, total
        FROM order_items
        WHERE order_id = ?
        ORDER BY created_at ASC`
      )
      .bind(orderId)
      .all<AdminOrderItemRow>();
  }

  getPayments(orderId: string) {
    return this.db
      .prepare(
        `SELECT
          p.id,
          p.provider,
          p.provider_reference,
          p.method,
          p.status,
          p.amount,
          p.confirmed_at,
          a.name AS confirmed_by_name
        FROM payments p
        LEFT JOIN admins a ON a.id = p.confirmed_by
        WHERE p.order_id = ?
        ORDER BY p.created_at DESC`
      )
      .bind(orderId)
      .all<AdminOrderPaymentRow>();
  }

  getReceipts(orderId: string) {
    return this.db
      .prepare(
        `SELECT id, file_name, mime_type, file_size, uploaded_at, reviewed_at, review_notes
        FROM payment_receipts
        WHERE order_id = ?
        ORDER BY uploaded_at DESC`
      )
      .bind(orderId)
      .all<AdminOrderReceiptRow>();
  }

  getReceiptForDownload(orderId: string, receiptId: string) {
    return this.db
      .prepare(
        `SELECT r2_key, file_name, mime_type
        FROM payment_receipts
        WHERE order_id = ? AND id = ?
        LIMIT 1`
      )
      .bind(orderId, receiptId)
      .first<{ r2_key: string; file_name: string; mime_type: string }>();
  }

  getHistory(orderId: string) {
    return this.db
      .prepare(
        `SELECT
          h.previous_status,
          h.new_status,
          h.note,
          h.created_at,
          a.name AS admin_name
        FROM order_status_history h
        LEFT JOIN admins a ON a.id = h.changed_by_admin_id
        WHERE h.order_id = ?
        ORDER BY h.created_at ASC`
      )
      .bind(orderId)
      .all<AdminOrderHistoryRow>();
  }

  getAddress(orderId: string) {
    return this.db
      .prepare(
        `SELECT a.postal_code, a.street, a.number, a.complement, a.neighborhood, a.city, a.state
        FROM orders o
        INNER JOIN addresses a ON a.id = o.address_id
        WHERE o.id = ?
        LIMIT 1`
      )
      .bind(orderId)
      .first<AdminOrderAddressRow>();
  }

  async updateStatus(input: {
    orderId: string;
    adminId: string;
    previousStatus: string;
    status: string;
    note?: string;
  }) {
    await this.db.batch([
      this.db
        .prepare(
          `UPDATE orders
          SET status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(input.status, input.orderId),
      this.db
        .prepare(
          `INSERT INTO order_status_history (
            id, order_id, previous_status, new_status, note, changed_by_admin_id
          ) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          input.orderId,
          input.previousStatus,
          input.status,
          input.note || null,
          input.adminId
        )
    ]);
  }

  async updatePayment(input: {
    orderId: string;
    adminId: string;
    previousStatus: string;
    orderStatus: string;
    paymentStatus: string;
    note: string;
    confirmPayment: boolean;
    reviewReceipt?: boolean;
  }) {
    const confirmedAt = input.confirmPayment ? new Date().toISOString() : null;

    const statements: D1PreparedStatement[] = [
      this.db
        .prepare(
          `UPDATE orders
          SET status = ?,
            payment_status = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(input.orderStatus, input.paymentStatus, input.orderId),
      this.db
        .prepare(
          `UPDATE payments
          SET status = ?,
            confirmed_by = CASE WHEN ? THEN ? ELSE confirmed_by END,
            confirmed_at = CASE WHEN ? THEN ? ELSE confirmed_at END,
            updated_at = CURRENT_TIMESTAMP
          WHERE order_id = ?`
        )
        .bind(
          input.paymentStatus,
          input.confirmPayment ? 1 : 0,
          input.adminId,
          input.confirmPayment ? 1 : 0,
          confirmedAt,
          input.orderId
        ),
      this.db
        .prepare(
          `INSERT INTO order_status_history (
            id, order_id, previous_status, new_status, note, changed_by_admin_id
          ) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          input.orderId,
          input.previousStatus,
          input.orderStatus,
          input.note,
          input.adminId
        )
    ];

    if (input.reviewReceipt) {
      statements.push(
        this.db
          .prepare(
            `UPDATE payment_receipts
            SET reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, review_notes = ?
            WHERE order_id = ?`
          )
          .bind(input.adminId, input.note, input.orderId)
      );
    }

    await this.db.batch(statements);
  }
}
