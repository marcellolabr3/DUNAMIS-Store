import { z } from 'zod';

export const adminOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'RECEIPT_SUBMITTED',
    'PAYMENT_REVIEW',
    'PAID',
    'PREPARING',
    'READY_FOR_PICKUP',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
    'EXPIRED'
  ]),
  note: z.string().trim().max(500).optional().default('')
});

export const adminPaymentActionSchema = z.object({
  action: z.enum(['review', 'confirm', 'reject']),
  note: z.string().trim().max(500).optional().default('')
});
