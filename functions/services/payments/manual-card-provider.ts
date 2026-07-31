import type {
  PaymentOrder,
  PaymentResult,
  PaymentStatus
} from './payment-types';
import type { PaymentProvider } from './payment-provider';

export class ManualCardProvider implements PaymentProvider {
  async createPayment(order: PaymentOrder): Promise<PaymentResult> {
    return {
      provider: 'manual_card',
      providerReference: `CARD-${order.orderNumber}`,
      method: 'card',
      status: 'PENDING',
      amount: order.total
    };
  }

  async getPaymentStatus(): Promise<PaymentStatus> {
    return 'PENDING';
  }

  async cancelPayment(): Promise<void> {
    return undefined;
  }
}
