import { OrderRepository } from '../repositories/order-repository';
import { createOrderSchema } from '../schemas/order-schema';
import { PaymentService } from './payments/payment-service';
import type {
  CheckoutProductRow,
  CreateOrderInput,
  CreateOrderResult
} from '../types/order';

export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly paymentService: PaymentService
  ) {}

  async createOrder(rawInput: unknown): Promise<CreateOrderResult> {
    const input = normalizeOrderInput(createOrderSchema.parse(rawInput));
    const existingOrder = await this.repository.findOrderByIdempotencyKey(
      input.idempotencyKey
    );

    if (existingOrder) {
      return existingOrder;
    }

    if (input.deliveryMethod === 'delivery' && !input.address) {
      throw new Error('Endereco de entrega obrigatorio.');
    }

    const products = await this.repository.getCheckoutProducts(input.items);
    const lines = buildOrderLines(input, products.results);
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const deliveryAmount = input.deliveryMethod === 'delivery' ? 0 : 0;
    const discountAmount = 0;
    const total = subtotal + deliveryAmount - discountAmount;
    const sequence = await this.repository.getNextOrderSequence();
    const orderNumber = createOrderNumber(sequence);
    const payment = await this.paymentService.createPayment({
      orderNumber,
      total
    });

    return this.repository.persistOrder({
      orderId: crypto.randomUUID(),
      orderNumber,
      publicToken: crypto.randomUUID(),
      lookupCode: createLookupCode(),
      customerId: crypto.randomUUID(),
      addressId: input.deliveryMethod === 'delivery' ? crypto.randomUUID() : undefined,
      paymentId: crypto.randomUUID(),
      items: lines,
      input,
      subtotal,
      deliveryAmount,
      discountAmount,
      total,
      payment
    });
  }
}

function normalizeOrderInput(input: CreateOrderInput): CreateOrderInput {
  return {
    ...input,
    customer: {
      ...input.customer,
      email: input.customer.email || undefined,
      notes: input.customer.notes || undefined
    },
    address: input.address
      ? {
          ...input.address,
          complement: input.address.complement || undefined
        }
      : undefined
  };
}

function buildOrderLines(input: CreateOrderInput, rows: CheckoutProductRow[]) {
  return input.items.map((item) => {
    const row = rows.find(
      (candidate) =>
        candidate.product_id === item.productId &&
        candidate.variant_id === item.variantId
    );

    if (!row) {
      throw new Error('Produto indisponivel.');
    }

    if (row.track_stock === 1 && item.quantity > row.stock_quantity) {
      throw new Error('Estoque insuficiente.');
    }

    const unitPrice =
      (row.promotional_price ?? row.product_price) + row.price_adjustment;

    return {
      id: crypto.randomUUID(),
      productId: row.product_id,
      variantId: row.variant_id,
      productName: row.product_name,
      variantName: row.variant_name,
      sku: row.variant_sku || row.product_sku,
      unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity
    };
  });
}

export function createOrderNumber(sequence: number, date = new Date()) {
  const year = date.getUTCFullYear();
  const paddedSequence = String(sequence).padStart(6, '0');

  return `DNS-${year}-${paddedSequence}`;
}

export function createLookupCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}
