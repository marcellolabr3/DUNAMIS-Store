import type { PaymentProvider } from './payment-provider';
import type { PaymentOrder } from './payment-types';

export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  createPayment(order: PaymentOrder) {
    return this.provider.createPayment(order);
  }
}
