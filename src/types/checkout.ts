import type { CartItem } from './cart';

export type DeliveryMethod = 'pickup' | 'delivery';

export interface CheckoutCustomer {
  fullName: string;
  whatsapp: string;
  email?: string;
  notes?: string;
}

export interface CheckoutAddress {
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CheckoutDraft {
  customer: CheckoutCustomer;
  deliveryMethod: DeliveryMethod;
  address?: CheckoutAddress;
  items: CartItem[];
  idempotencyKey: string;
}

export interface CreatedOrder {
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

export interface UploadedReceipt {
  receiptId: string;
  orderNumber: string;
  status: 'RECEIPT_SUBMITTED';
  uploadedAt: string;
}
