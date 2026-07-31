import { AdminOrderRepository } from '../repositories/admin-order-repository';
import {
  adminOrderStatusSchema,
  adminPaymentActionSchema
} from '../schemas/admin-order-schema';
import { getOrderStatusLabel } from './order-status';
import type {
  AdminOrderAddressRow,
  AdminOrderHistoryRow,
  AdminOrderItemRow,
  AdminOrderPaymentRow,
  AdminOrderReceiptRow,
  AdminOrderRow
} from '../types/admin-order';

export class AdminOrderService {
  constructor(private readonly repository: AdminOrderRepository) {}

  async list(filters: {
    query?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const orders = await this.repository.getOrders(filters);

    return orders.results.map(mapOrderSummary);
  }

  async details(id: string) {
    const order = await this.repository.getOrder(id);

    if (!order) {
      return undefined;
    }

    const [items, payments, receipts, history, address] = await Promise.all([
      this.repository.getItems(id),
      this.repository.getPayments(id),
      this.repository.getReceipts(id),
      this.repository.getHistory(id),
      this.repository.getAddress(id)
    ]);

    return {
      ...mapOrderSummary(order),
      customer: {
        name: order.customer_name,
        whatsapp: order.customer_whatsapp,
        email: order.customer_email
      },
      customerNotes: order.customer_notes,
      internalNotes: order.internal_notes,
      address: address ? mapAddress(address) : undefined,
      items: items.results.map(mapItem),
      payments: payments.results.map(mapPayment),
      receipts: receipts.results.map((receipt) => mapReceipt(order.id, receipt)),
      history: history.results.map(mapHistory)
    };
  }

  async updateStatus(id: string, adminId: string, input: unknown) {
    const parsed = adminOrderStatusSchema.parse(input);
    const order = await this.repository.getOrder(id);

    if (!order) {
      return undefined;
    }

    await this.repository.updateStatus({
      orderId: id,
      adminId,
      previousStatus: order.status,
      status: parsed.status,
      note: parsed.note || `Status alterado para ${getOrderStatusLabel(parsed.status)}.`
    });

    return this.details(id);
  }

  async updatePayment(id: string, adminId: string, input: unknown) {
    const parsed = adminPaymentActionSchema.parse(input);
    const order = await this.repository.getOrder(id);

    if (!order) {
      return undefined;
    }

    const paymentChange = {
      review: {
        orderStatus: 'PAYMENT_REVIEW',
        paymentStatus: 'PAYMENT_REVIEW',
        note: parsed.note || 'Pagamento colocado em analise.',
        confirmPayment: false,
        reviewReceipt: false
      },
      confirm: {
        orderStatus: 'PAID',
        paymentStatus: 'PAID',
        note: parsed.note || 'Pagamento confirmado manualmente.',
        confirmPayment: true,
        reviewReceipt: true
      },
      reject: {
        orderStatus: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING_PAYMENT',
        note: parsed.note || 'Comprovante rejeitado manualmente.',
        confirmPayment: false,
        reviewReceipt: true
      }
    }[parsed.action];

    await this.repository.updatePayment({
      orderId: id,
      adminId,
      previousStatus: order.status,
      ...paymentChange
    });

    return this.details(id);
  }

  getReceiptForDownload(orderId: string, receiptId: string) {
    return this.repository.getReceiptForDownload(orderId, receiptId);
  }
}

export const adminOrderStatuses = [
  'PENDING_PAYMENT',
  'RECEIPT_SUBMITTED',
  'PAYMENT_REVIEW',
  'PAID',
  'PREPARING',
  'READY_FOR_PICKUP',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED'
];

function mapOrderSummary(row: AdminOrderRow) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    statusLabel: getOrderStatusLabel(row.status),
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    deliveryMethod: row.delivery_method,
    subtotal: row.subtotal,
    deliveryAmount: row.delivery_amount,
    discountAmount: row.discount_amount,
    total: row.total,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    customerName: row.customer_name,
    customerWhatsapp: row.customer_whatsapp,
    customerEmail: row.customer_email
  };
}

function mapItem(row: AdminOrderItemRow) {
  return {
    productName: row.product_name,
    variantName: row.variant_name,
    sku: row.sku,
    unitPrice: row.unit_price,
    quantity: row.quantity,
    total: row.total
  };
}

function mapPayment(row: AdminOrderPaymentRow) {
  return {
    id: row.id,
    provider: row.provider,
    providerReference: row.provider_reference,
    method: row.method,
    status: row.status,
    amount: row.amount,
    confirmedAt: row.confirmed_at,
    confirmedByName: row.confirmed_by_name
  };
}

function mapReceipt(orderId: string, row: AdminOrderReceiptRow) {
  return {
    id: row.id,
    fileName: row.file_name,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    uploadedAt: row.uploaded_at,
    reviewedAt: row.reviewed_at,
    reviewNotes: row.review_notes,
    downloadUrl: `/api/admin/orders/${orderId}/receipts/${row.id}`
  };
}

function mapHistory(row: AdminOrderHistoryRow) {
  return {
    previousStatus: row.previous_status,
    status: row.new_status,
    statusLabel: getOrderStatusLabel(row.new_status),
    note: row.note,
    createdAt: row.created_at,
    adminName: row.admin_name
  };
}

function mapAddress(row: AdminOrderAddressRow) {
  return {
    postalCode: row.postal_code,
    street: row.street,
    number: row.number,
    complement: row.complement,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state
  };
}
