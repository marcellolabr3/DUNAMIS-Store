export interface ReceiptUploadResult {
  receiptId: string;
  orderNumber: string;
  status: 'RECEIPT_SUBMITTED';
  uploadedAt: string;
}

export interface ReceiptOrderRow {
  order_id: string;
  order_number: string;
  status: string;
  payment_id: string;
}
