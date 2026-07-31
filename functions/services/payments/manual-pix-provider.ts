import QRCode from 'qrcode';

import type { StoreSettings } from '../../types/store-settings';
import type { PaymentOrder, PaymentResult, PaymentStatus } from './payment-types';
import type { PaymentProvider } from './payment-provider';

export class ManualPixProvider implements PaymentProvider {
  constructor(private readonly settings: StoreSettings) {}

  async createPayment(order: PaymentOrder): Promise<PaymentResult> {
    if (!this.settings.pixKey.trim()) {
      throw new Error('Chave Pix nao configurada.');
    }

    const pixPayload = createPixPayload({
      pixKey: this.settings.pixKey,
      receiverName: this.settings.pixReceiverName,
      receiverCity: this.settings.pixReceiverCity,
      amount: order.total,
      txid: normalizeTxid(order.orderNumber)
    });
    const qrCodeDataUrl = await QRCode.toDataURL(pixPayload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320
    });
    const expiresAt = new Date(
      Date.now() + this.settings.orderExpirationMinutes * 60 * 1000
    ).toISOString();

    return {
      provider: 'manual_pix',
      providerReference: order.orderNumber,
      method: 'pix',
      status: 'PENDING',
      amount: order.total,
      pixPayload,
      qrCodeDataUrl,
      expiresAt
    };
  }

  getPaymentStatus(): Promise<PaymentStatus> {
    return Promise.resolve('PENDING');
  }

  cancelPayment(): Promise<void> {
    return Promise.resolve();
  }
}

interface PixPayloadInput {
  pixKey: string;
  receiverName: string;
  receiverCity: string;
  amount: number;
  txid: string;
}

export function createPixPayload(input: PixPayloadInput) {
  const merchantAccountInfo = buildField(
    '26',
    buildField('00', 'br.gov.bcb.pix') + buildField('01', input.pixKey.trim())
  );
  const additionalData = buildField('62', buildField('05', input.txid));
  const payloadWithoutCrc =
    buildField('00', '01') +
    buildField('01', '12') +
    merchantAccountInfo +
    buildField('52', '0000') +
    buildField('53', '986') +
    buildField('54', formatPixAmount(input.amount)) +
    buildField('58', 'BR') +
    buildField('59', normalizePixText(input.receiverName, 25)) +
    buildField('60', normalizePixText(input.receiverCity, 15)) +
    additionalData +
    '6304';

  return `${payloadWithoutCrc}${crc16(payloadWithoutCrc)}`;
}

function buildField(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

function formatPixAmount(amountInCents: number) {
  return (amountInCents / 100).toFixed(2);
}

function normalizePixText(value: string, maxLength: number) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

function normalizeTxid(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || 'DUNAMISSTORE';
}

export function crc16(payload: string) {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}
