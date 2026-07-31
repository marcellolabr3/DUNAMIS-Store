import {
  crc16,
  createPixPayload
} from '../functions/services/payments/manual-pix-provider';

describe('ManualPixProvider payload helpers', () => {
  it('generates a Pix payload with amount and order reference', () => {
    const payload = createPixPayload({
      pixKey: 'pix-demo@dunamisstore.local',
      receiverName: 'DUNAMIS STORE',
      receiverCity: 'SAO PAULO',
      amount: 6990,
      txid: 'DNS2026000001'
    });

    expect(payload).toContain('br.gov.bcb.pix');
    expect(payload).toContain('pix-demo@dunamisstore.local');
    expect(payload).toContain('540569.90');
    expect(payload).toContain('DNS2026000001');
    expect(payload).toMatch(/6304[A-F0-9]{4}$/);
  });

  it('calculates a deterministic CRC16 checksum', () => {
    expect(crc16('123456789')).toBe('29B1');
  });
});
