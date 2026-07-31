export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

export interface PaymentOrder {
  orderNumber: string;
  total: number;
}

export interface PaymentResult {
  provider: 'manual_pix';
  providerReference: string;
  method: 'pix';
  status: PaymentStatus;
  amount: number;
  pixPayload: string;
  qrCodeDataUrl: string;
  expiresAt: string;
}
