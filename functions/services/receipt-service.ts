import { ReceiptRepository } from '../repositories/receipt-repository';
import type { ReceiptUploadResult } from '../types/receipt';

const maxReceiptSize = 5 * 1024 * 1024;
const allowedReceiptMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf'
]);

const allowedReceiptExtensions = new Set(['jpg', 'jpeg', 'png', 'pdf']);

export class ReceiptService {
  constructor(
    private readonly repository: ReceiptRepository,
    private readonly bucket: R2Bucket
  ) {}

  async uploadReceipt(input: {
    publicToken: string;
    file: File;
    ipAddress?: string;
  }): Promise<ReceiptUploadResult> {
    validateReceiptFile(input.file);

    const order = await this.repository.findOrderForReceipt(input.publicToken);

    if (!order) {
      throw new Error('Pedido nao encontrado ou indisponivel para comprovante.');
    }

    const receiptId = crypto.randomUUID();
    const extension = getFileExtension(input.file.name);
    const r2Key = `receipts/${order.order_number}/${receiptId}.${extension}`;
    const uploadedAt = new Date().toISOString();
    const uploadedIpHash = input.ipAddress
      ? await hashIpAddress(input.ipAddress)
      : undefined;

    await this.bucket.put(r2Key, input.file.stream(), {
      httpMetadata: {
        contentType: input.file.type
      },
      customMetadata: {
        orderNumber: order.order_number,
        receiptId
      }
    });

    return this.repository.saveReceipt({
      receiptId,
      orderId: order.order_id,
      orderNumber: order.order_number,
      paymentId: order.payment_id,
      previousStatus: order.status,
      r2Key,
      fileName: `${receiptId}.${extension}`,
      mimeType: input.file.type,
      fileSize: input.file.size,
      uploadedIpHash,
      uploadedAt
    });
  }
}

export function validateReceiptFile(file: File) {
  const extension = getFileExtension(file.name);

  if (!allowedReceiptExtensions.has(extension)) {
    throw new Error('Extensao de arquivo invalida.');
  }

  if (!allowedReceiptMimeTypes.has(file.type)) {
    throw new Error('Tipo de arquivo invalido.');
  }

  if (file.size <= 0 || file.size > maxReceiptSize) {
    throw new Error('Arquivo excede o tamanho permitido.');
  }
}

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

async function hashIpAddress(ipAddress: string) {
  const encoded = new TextEncoder().encode(ipAddress);
  const digest = await crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}
