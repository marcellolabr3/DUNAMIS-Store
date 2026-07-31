export interface OrderTrackingRow {
  id: string;
  order_number: string;
  lookup_code: string;
  status: string;
  payment_status: string;
  payment_method: string;
  delivery_method: string;
  subtotal: number;
  delivery_amount: number;
  discount_amount: number;
  total: number;
  created_at: string;
  pix_expiration_at: string | null;
  customer_name: string;
}

export interface OrderTrackingItemRow {
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface OrderTrackingHistoryRow {
  new_status: string;
  note: string | null;
  created_at: string;
}

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
