export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
export type PaymentProviderName = 'manual_pix' | 'manual_card';
export type PaymentMethod = 'pix' | 'card';

export interface PaymentOrder {
  orderNumber: string;
  total: number;
}

export interface PaymentResult {
  provider: PaymentProviderName;
  providerReference: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  pixPayload?: string;
  qrCodeDataUrl?: string;
  expiresAt?: string;
}
