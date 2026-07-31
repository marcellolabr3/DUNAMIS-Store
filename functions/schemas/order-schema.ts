import { z } from 'zod';

export const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(3).max(120),
    whatsapp: z.string().trim().min(8).max(40),
    email: z.string().trim().email().max(180).optional().or(z.literal('')),
    notes: z.string().trim().max(1000).optional().or(z.literal(''))
  }),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  address: z
    .object({
      postalCode: z.string().trim().min(8).max(12),
      street: z.string().trim().min(2).max(160),
      number: z.string().trim().min(1).max(30),
      complement: z.string().trim().max(80).optional().or(z.literal('')),
      neighborhood: z.string().trim().min(2).max(120),
      city: z.string().trim().min(2).max(120),
      state: z.string().trim().min(2).max(2)
    })
    .optional(),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        variantId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(99)
      })
    )
    .min(1),
  idempotencyKey: z.string().trim().min(16).max(120),
  turnstileToken: z.string().trim().optional()
});

export type CreateOrderInputSchema = z.infer<typeof createOrderSchema>;
