import { createLookupCode, createOrderNumber } from '../functions/services/order-service';

describe('order-service helpers', () => {
  it('generates the public order number with year and sequence', () => {
    expect(createOrderNumber(123, new Date('2026-07-31T00:00:00.000Z'))).toBe(
      'DNS-2026-000123'
    );
  });

  it('generates a six-character lookup code', () => {
    expect(createLookupCode()).toMatch(/^[A-Z2-9]{6}$/);
  });
});
