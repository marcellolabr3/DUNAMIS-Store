import type { ReceiptOrderRow, ReceiptUploadResult } from '../types/receipt';

interface SaveReceiptInput {
  receiptId: string;
  orderId: string;
  orderNumber: string;
  paymentId: string;
  previousStatus: string;
  r2Key: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedIpHash?: string;
  uploadedAt: string;
}

export class ReceiptRepository {
  constructor(private readonly db: D1Database) {}

  async findOrderForReceipt(publicToken: string) {
    return this.db
      .prepare(
        `SELECT
          o.id AS order_id,
          o.order_number,
          o.status,
          p.id AS payment_id
        FROM orders o
        INNER JOIN payments p ON p.order_id = o.id
        WHERE o.public_token = ?
          AND o.status IN ('PENDING_PAYMENT', 'RECEIPT_SUBMITTED', 'PAYMENT_REVIEW')
        LIMIT 1`
      )
      .bind(publicToken)
      .first<ReceiptOrderRow>();
  }

  async saveReceipt(input: SaveReceiptInput): Promise<ReceiptUploadResult> {
    await this.db.batch([
      this.db
        .prepare(
          `INSERT INTO payment_receipts (
            id,
            order_id,
            payment_id,
            r2_key,
            file_name,
            mime_type,
            file_size,
            uploaded_at,
            uploaded_ip_hash
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          input.receiptId,
          input.orderId,
          input.paymentId,
          input.r2Key,
          input.fileName,
          input.mimeType,
          input.fileSize,
          input.uploadedAt,
          input.uploadedIpHash || null
        ),
      this.db
        .prepare(
          `UPDATE orders
          SET status = 'RECEIPT_SUBMITTED',
            payment_status = 'RECEIPT_SUBMITTED',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(input.orderId),
      this.db
        .prepare(
          `UPDATE payments
          SET status = 'RECEIPT_SUBMITTED',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(input.paymentId),
      this.db
        .prepare(
          `INSERT INTO order_status_history (
            id,
            order_id,
            previous_status,
            new_status,
            note
          ) VALUES (?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          input.orderId,
          input.previousStatus,
          'RECEIPT_SUBMITTED',
          'Comprovante enviado pelo cliente.'
        )
    ]);

    return {
      receiptId: input.receiptId,
      orderNumber: input.orderNumber,
      status: 'RECEIPT_SUBMITTED',
      uploadedAt: input.uploadedAt
    };
  }
}
