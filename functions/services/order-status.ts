const orderStatusLabels: Record<string, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  RECEIPT_SUBMITTED: 'Comprovante enviado',
  PAYMENT_REVIEW: 'Pagamento em analise',
  PAID: 'Pagamento confirmado',
  PREPARING: 'Preparando pedido',
  READY_FOR_PICKUP: 'Pronto para retirada',
  SHIPPED: 'Enviado',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado'
};

export function getOrderStatusLabel(status: string) {
  return orderStatusLabels[status] ?? status;
}
