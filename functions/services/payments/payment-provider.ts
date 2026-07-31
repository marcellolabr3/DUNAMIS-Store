import type {
  PaymentOrder,
  PaymentResult,
  PaymentStatus
} from './payment-types';

export interface PaymentProvider {
  createPayment(order: PaymentOrder): Promise<PaymentResult>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
  cancelPayment(reference: string): Promise<void>;
}
