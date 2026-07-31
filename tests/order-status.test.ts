import { getOrderStatusLabel } from '../functions/services/order-status';

describe('order status labels', () => {
  it('returns friendly labels for dashboard and reports', () => {
    expect(getOrderStatusLabel('PENDING_PAYMENT')).toBe('Aguardando pagamento');
    expect(getOrderStatusLabel('READY_FOR_PICKUP')).toBe('Pronto para retirada');
  });

  it('falls back to the raw status when unknown', () => {
    expect(getOrderStatusLabel('CUSTOM_STATUS')).toBe('CUSTOM_STATUS');
  });
});
