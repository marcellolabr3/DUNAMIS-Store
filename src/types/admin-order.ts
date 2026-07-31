export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryMethod: string;
  subtotal: number;
  deliveryAmount: number;
  discountAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string | null;
}

export interface AdminOrderDetails extends AdminOrderSummary {
  customer: {
    name: string;
    whatsapp: string;
    email: string | null;
  };
  customerNotes: string | null;
  internalNotes: string | null;
  address?: {
    postalCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: Array<{
    productName: string;
    variantName: string | null;
    sku: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  payments: Array<{
    id: string;
    provider: string;
    providerReference: string;
    method: string;
    status: string;
    amount: number;
    confirmedAt: string | null;
    confirmedByName: string | null;
  }>;
  receipts: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: string;
    reviewedAt: string | null;
    reviewNotes: string | null;
    downloadUrl: string;
  }>;
  history: Array<{
    previousStatus: string | null;
    status: string;
    statusLabel: string;
    note: string | null;
    createdAt: string;
    adminName: string | null;
  }>;
}

export const adminOrderStatuses = [
  { value: 'PENDING_PAYMENT', label: 'Aguardando pagamento' },
  { value: 'RECEIPT_SUBMITTED', label: 'Comprovante enviado' },
  { value: 'PAYMENT_REVIEW', label: 'Pagamento em analise' },
  { value: 'PAID', label: 'Pagamento confirmado' },
  { value: 'PREPARING', label: 'Preparando pedido' },
  { value: 'READY_FOR_PICKUP', label: 'Pronto para retirada' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'COMPLETED', label: 'Concluido' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'EXPIRED', label: 'Expirado' }
];
