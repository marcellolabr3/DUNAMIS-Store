export interface CountRow {
  count: number;
}

export interface SalesRow {
  total: number | null;
}

export interface LowStockRow {
  product_name: string;
  variant_name: string;
  sku: string;
  stock_quantity: number;
}

export interface RecentOrderRow {
  order_number: string;
  customer_name: string;
  status: string;
  total: number;
  created_at: string;
}

export class AdminReportRepository {
  constructor(private readonly db: D1Database) {}

  countOrdersByStatus(status: string) {
    return this.db
      .prepare('SELECT COUNT(*) AS count FROM orders WHERE status = ?')
      .bind(status)
      .first<CountRow>();
  }

  salesToday() {
    return this.db
      .prepare(
        `SELECT SUM(total) AS total
        FROM orders
        WHERE status IN ('PAID', 'PREPARING', 'READY_FOR_PICKUP', 'SHIPPED', 'COMPLETED')
          AND date(created_at) = date('now')`
      )
      .first<SalesRow>();
  }

  salesMonth() {
    return this.db
      .prepare(
        `SELECT SUM(total) AS total
        FROM orders
        WHERE status IN ('PAID', 'PREPARING', 'READY_FOR_PICKUP', 'SHIPPED', 'COMPLETED')
          AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
      )
      .first<SalesRow>();
  }

  lowStock(limit = 12) {
    return this.db
      .prepare(
        `SELECT
          p.name AS product_name,
          v.name AS variant_name,
          v.sku,
          v.stock_quantity
        FROM product_variants v
        INNER JOIN products p ON p.id = v.product_id
        WHERE p.deleted_at IS NULL
          AND p.track_stock = 1
          AND v.active = 1
          AND v.stock_quantity <= 5
        ORDER BY v.stock_quantity ASC, p.name ASC
        LIMIT ?`
      )
      .bind(limit)
      .all<LowStockRow>();
  }

  recentOrders(limit = 10) {
    return this.db
      .prepare(
        `SELECT
          o.order_number,
          c.full_name AS customer_name,
          o.status,
          o.total,
          o.created_at
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        ORDER BY o.created_at DESC
        LIMIT ?`
      )
      .bind(limit)
      .all<RecentOrderRow>();
  }

  csvOrders() {
    return this.db
      .prepare(
        `SELECT
          o.order_number,
          c.full_name AS customer_name,
          c.whatsapp,
          o.status,
          o.delivery_method,
          o.total,
          o.created_at
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        ORDER BY o.created_at DESC
        LIMIT 1000`
      )
      .all<{
        order_number: string;
        customer_name: string;
        whatsapp: string;
        status: string;
        delivery_method: string;
        total: number;
        created_at: string;
      }>();
  }
}
