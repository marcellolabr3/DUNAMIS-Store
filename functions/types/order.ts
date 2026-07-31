export type DeliveryMethod = 'pickup' | 'delivery';

export interface OrderCartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customer: {
    fullName: string;
    whatsapp: string;
    email?: string;
    notes?: string;
  };
  deliveryMethod: DeliveryMethod;
  address?: {
    postalCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: OrderCartItem[];
  idempotencyKey: string;
  turnstileToken?: string;
}

export interface CreateOrderResult {
  orderNumber: string;
  lookupCode: string;
  publicToken: string;
  total: number;
  status: string;
  payment: {
    method: 'pix';
    provider: 'manual_pix';
    pixPayload: string;
    qrCodeDataUrl: string;
    expiresAt: string;
  };
}

export interface CheckoutProductRow {
  product_id: string;
  product_name: string;
  product_sku: string;
  product_price: number;
  promotional_price: number | null;
  track_stock: number;
  variant_id: string;
  variant_name: string;
  variant_sku: string;
  price_adjustment: number;
  stock_quantity: number;
}
