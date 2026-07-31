import { AdminReportRepository } from '../repositories/admin-report-repository';
import { getOrderStatusLabel } from './order-status';

export class AdminReportService {
  constructor(private readonly repository: AdminReportRepository) {}

  async dashboard() {
    const [
      pendingPayment,
      receiptSubmitted,
      paid,
      preparing,
      readyForPickup,
      salesToday,
      salesMonth,
      lowStock,
      recentOrders
    ] = await Promise.all([
      this.repository.countOrdersByStatus('PENDING_PAYMENT'),
      this.repository.countOrdersByStatus('RECEIPT_SUBMITTED'),
      this.repository.countOrdersByStatus('PAID'),
      this.repository.countOrdersByStatus('PREPARING'),
      this.repository.countOrdersByStatus('READY_FOR_PICKUP'),
      this.repository.salesToday(),
      this.repository.salesMonth(),
      this.repository.lowStock(),
      this.repository.recentOrders()
    ]);

    return {
      metrics: {
        pendingPayment: pendingPayment?.count ?? 0,
        receiptSubmitted: receiptSubmitted?.count ?? 0,
        paid: paid?.count ?? 0,
        preparing: preparing?.count ?? 0,
        readyForPickup: readyForPickup?.count ?? 0,
        salesToday: salesToday?.total ?? 0,
        salesMonth: salesMonth?.total ?? 0
      },
      lowStock: lowStock.results.map((item) => ({
        productName: item.product_name,
        variantName: item.variant_name,
        sku: item.sku,
        stockQuantity: item.stock_quantity
      })),
      recentOrders: recentOrders.results.map((order) => ({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        status: order.status,
        statusLabel: getOrderStatusLabel(order.status),
        total: order.total,
        createdAt: order.created_at
      }))
    };
  }

  async ordersCsv() {
    const rows = await this.repository.csvOrders();
    const csvRows = [
      ['pedido', 'cliente', 'whatsapp', 'status', 'recebimento', 'total', 'criado_em'],
      ...rows.results.map((row) => [
        row.order_number,
        row.customer_name,
        row.whatsapp,
        getOrderStatusLabel(row.status),
        row.delivery_method,
        (row.total / 100).toFixed(2),
        row.created_at
      ])
    ];

    return csvRows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
  }
}
