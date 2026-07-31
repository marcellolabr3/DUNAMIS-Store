import type {
  CheckoutProductRow,
  CreateOrderInput,
  CreateOrderResult
} from '../types/order';
import type { PaymentResult } from '../services/payments/payment-types';

interface PersistOrderInput {
  orderId: string;
  orderNumber: string;
  publicToken: string;
  lookupCode: string;
  customerId: string;
  addressId?: string;
  paymentId: string;
  payment: PaymentResult;
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
        `SELECT
          o.order_number,
          o.lookup_code,
          o.public_token,
          o.total,
          o.status,
          o.pix_payload,
          o.pix_expiration_at,
          p.provider,
          p.method,
          p.metadata
        FROM order_idempotency_keys k
        INNER JOIN orders o ON o.id = k.order_id
        INNER JOIN payments p ON p.order_id = o.id
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
        pix_payload: string;
        pix_expiration_at: string;
        provider: 'manual_pix';
        method: 'pix';
        metadata: string;
      }>();

    if (!row) {
      return undefined;
    }

    const metadata = parsePaymentMetadata(row.metadata);

    return {
      orderNumber: row.order_number,
      lookupCode: row.lookup_code,
      publicToken: row.public_token,
      total: row.total,
      status: row.status,
      payment: {
        method: row.method,
        provider: row.provider,
        pixPayload: row.pix_payload,
        qrCodeDataUrl: metadata.qrCodeDataUrl ?? '',
        expiresAt: row.pix_expiration_at
      }
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
            customer_notes,
            pix_payload,
            pix_expiration_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
          input.input.customer.notes || null,
          input.payment.pixPayload,
          input.payment.expiresAt
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
          input.payment.provider,
          input.payment.providerReference,
          input.payment.method,
          input.payment.status,
          input.payment.amount,
          JSON.stringify({
            idempotencyKey: input.input.idempotencyKey,
            pixExpiresAt: input.payment.expiresAt,
            qrCodeDataUrl: input.payment.qrCodeDataUrl
          })
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
      status: 'PENDING_PAYMENT',
      payment: {
        method: input.payment.method,
        provider: input.payment.provider,
        pixPayload: input.payment.pixPayload,
        qrCodeDataUrl: input.payment.qrCodeDataUrl,
        expiresAt: input.payment.expiresAt
      }
    };
  }
}

function parsePaymentMetadata(metadata: string): { qrCodeDataUrl?: string } {
  try {
    const parsed = JSON.parse(metadata) as { qrCodeDataUrl?: string };

    return parsed;
  } catch {
    return {};
  }
}
