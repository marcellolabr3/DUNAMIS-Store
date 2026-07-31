import type {
  CheckoutProductRow,
  CreateOrderInput,
  CreateOrderResult
} from '../types/order';

interface PersistOrderInput {
  orderId: string;
  orderNumber: string;
  publicToken: string;
  lookupCode: string;
  customerId: string;
  addressId?: string;
  paymentId: string;
  items: Array<{
    id: string;
    productId: string;
    variantId: string;
    productName: string;
    variantName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  input: CreateOrderInput;
  subtotal: number;
  deliveryAmount: number;
  discountAmount: number;
  total: number;
}

export class OrderRepository {
  constructor(private readonly db: D1Database) {}

  async findOrderByIdempotencyKey(
    idempotencyKey: string
  ): Promise<CreateOrderResult | undefined> {
    const row = await this.db
      .prepare(
        `SELECT o.order_number, o.lookup_code, o.public_token, o.total, o.status
        FROM order_idempotency_keys k
        INNER JOIN orders o ON o.id = k.order_id
        WHERE k.idempotency_key = ?
        LIMIT 1`
      )
      .bind(idempotencyKey)
      .first<{
        order_number: string;
        lookup_code: string;
        public_token: string;
        total: number;
        status: string;
      }>();

    if (!row) {
      return undefined;
    }

    return {
      orderNumber: row.order_number,
      lookupCode: row.lookup_code,
      publicToken: row.public_token,
      total: row.total,
      status: row.status
    };
  }

  async getCheckoutProducts(items: CreateOrderInput['items']) {
    const pairs = items.map(() => '(p.id = ? AND v.id = ?)').join(' OR ');
    const bindings = items.flatMap((item) => [item.productId, item.variantId]);

    return this.db
      .prepare(
        `SELECT
          p.id AS product_id,
          p.name AS product_name,
          p.sku AS product_sku,
          p.price AS product_price,
          p.promotional_price,
          p.track_stock,
          v.id AS variant_id,
          v.name AS variant_name,
          v.sku AS variant_sku,
          v.price_adjustment,
          v.stock_quantity
        FROM products p
        INNER JOIN product_variants v ON v.product_id = p.id
        WHERE p.active = 1
          AND p.deleted_at IS NULL
          AND v.active = 1
          AND (${pairs})`
      )
      .bind(...bindings)
      .all<CheckoutProductRow>();
  }

  async getNextOrderSequence(): Promise<number> {
    const row = await this.db
      .prepare('SELECT COUNT(*) AS count FROM orders')
      .first<{ count: number }>();

    return (row?.count ?? 0) + 1;
  }

  async persistOrder(input: PersistOrderInput): Promise<CreateOrderResult> {
    const statements: D1PreparedStatement[] = [
      this.db
        .prepare(
          `INSERT INTO customers (id, full_name, whatsapp, email)
          VALUES (?, ?, ?, ?)`
        )
        .bind(
          input.customerId,
          input.input.customer.fullName,
          input.input.customer.whatsapp,
          input.input.customer.email || null
        )
    ];

    if (input.input.deliveryMethod === 'delivery' && input.input.address) {
      statements.push(
        this.db
          .prepare(
            `INSERT INTO addresses (
              id,
              customer_id,
              postal_code,
              street,
              number,
              complement,
              neighborhood,
              city,
              state
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            input.addressId,
            input.customerId,
            input.input.address.postalCode,
            input.input.address.street,
            input.input.address.number,
            input.input.address.complement || null,
            input.input.address.neighborhood,
            input.input.address.city,
            input.input.address.state
          )
      );
    }

    statements.push(
      this.db
        .prepare(
          `INSERT INTO orders (
            id,
            order_number,
            public_token,
            lookup_code,
            customer_id,
            address_id,
            status,
            payment_status,
            payment_method,
            delivery_method,
            subtotal,
            delivery_amount,
            discount_amount,
            total,
            customer_notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          input.orderId,
          input.orderNumber,
          input.publicToken,
          input.lookupCode,
          input.customerId,
          input.addressId || null,
          'PENDING_PAYMENT',
          'PENDING',
          'manual_pix',
          input.input.deliveryMethod,
          input.subtotal,
          input.deliveryAmount,
          input.discountAmount,
          input.total,
          input.input.customer.notes || null
        ),
      this.db
        .prepare(
          `INSERT INTO order_idempotency_keys (idempotency_key, order_id)
          VALUES (?, ?)`
        )
        .bind(input.input.idempotencyKey, input.orderId),
      this.db
        .prepare(
          `INSERT INTO payments (
            id,
            order_id,
            provider,
            provider_reference,
            method,
            status,
            amount,
            metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          input.paymentId,
          input.orderId,
          'manual_pix',
          input.orderNumber,
          'pix',
          'PENDING',
          input.total,
          JSON.stringify({ idempotencyKey: input.input.idempotencyKey })
        ),
      this.db
        .prepare(
          `INSERT INTO order_status_history (
            id,
            order_id,
            previous_status,
            new_status,
            note
          ) VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          input.orderId,
          null,
          'PENDING_PAYMENT',
          'Pedido criado no checkout.'
        )
    );

    for (const item of input.items) {
      statements.push(
        this.db
          .prepare(
            `INSERT INTO order_items (
              id,
              order_id,
              product_id,
              variant_id,
              product_name,
              variant_name,
              sku,
              unit_price,
              quantity,
              total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            item.id,
            input.orderId,
            item.productId,
            item.variantId,
            item.productName,
            item.variantName,
            item.sku,
            item.unitPrice,
            item.quantity,
            item.total
          )
      );
    }

    await this.db.batch(statements);

    return {
      orderNumber: input.orderNumber,
      lookupCode: input.lookupCode,
      publicToken: input.publicToken,
      total: input.total,
      status: 'PENDING_PAYMENT'
    };
  }
}
