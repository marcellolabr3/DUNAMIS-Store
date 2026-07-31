import { getOrderStatusLabel } from '../functions/services/order-status';

describe('order status labels', () => {
  it('translates public order statuses', () => {
    expect(getOrderStatusLabel('PENDING_PAYMENT')).toBe('Aguardando pagamento');
    expect(getOrderStatusLabel('RECEIPT_SUBMITTED')).toBe('Comprovante enviado');
    expect(getOrderStatusLabel('PAYMENT_REVIEW')).toBe('Pagamento em analise');
    expect(getOrderStatusLabel('PAID')).toBe('Pagamento confirmado');
    expect(getOrderStatusLabel('PREPARING')).toBe('Preparando pedido');
    expect(getOrderStatusLabel('READY_FOR_PICKUP')).toBe('Pronto para retirada');
    expect(getOrderStatusLabel('SHIPPED')).toBe('Enviado');
    expect(getOrderStatusLabel('COMPLETED')).toBe('Concluido');
    expect(getOrderStatusLabel('CANCELLED')).toBe('Cancelado');
    expect(getOrderStatusLabel('EXPIRED')).toBe('Expirado');
  });
});
