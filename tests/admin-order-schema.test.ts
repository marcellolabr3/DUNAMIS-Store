import {
  adminOrderStatusSchema,
  adminPaymentActionSchema
} from '../functions/schemas/admin-order-schema';

describe('admin order schemas', () => {
  it('accepts a valid order status update', () => {
    const parsed = adminOrderStatusSchema.parse({
      status: 'READY_FOR_PICKUP',
      note: 'Pedido separado para retirada.'
    });

    expect(parsed.status).toBe('READY_FOR_PICKUP');
  });

  it('rejects unknown order statuses', () => {
    expect(() =>
      adminOrderStatusSchema.parse({
        status: 'AUTO_PAID'
      })
    ).toThrow();
  });

  it('accepts manual payment review actions only', () => {
    expect(adminPaymentActionSchema.parse({ action: 'confirm' }).action).toBe(
      'confirm'
    );
    expect(() =>
      adminPaymentActionSchema.parse({ action: 'auto_confirm' })
    ).toThrow();
  });
});
