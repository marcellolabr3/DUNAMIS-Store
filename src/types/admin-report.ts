export interface AdminReportData {
  metrics: {
    pendingPayment: number;
    receiptSubmitted: number;
    paid: number;
    preparing: number;
    readyForPickup: number;
    salesToday: number;
    salesMonth: number;
  };
  lowStock: Array<{
    productName: string;
    variantName: string;
    sku: string;
    stockQuantity: number;
  }>;
  recentOrders: Array<{
    orderNumber: string;
    customerName: string;
    status: string;
    statusLabel: string;
    total: number;
    createdAt: string;
  }>;
}
