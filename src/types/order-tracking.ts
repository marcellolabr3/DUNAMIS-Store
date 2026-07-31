export interface PublicOrderTracking {
  orderNumber: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryMethod: string;
  subtotal: number;
  deliveryAmount: number;
  discountAmount: number;
  total: number;
  createdAt: string;
  pixExpirationAt?: string;
  customerName: string;
  items: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  history: Array<{
    status: string;
    statusLabel: string;
    note?: string;
    createdAt: string;
  }>;
}
