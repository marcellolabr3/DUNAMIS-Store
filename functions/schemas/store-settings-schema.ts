import { z } from 'zod';

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(1).max(120),
  storeDescription: z.string().trim().min(1).max(500),
  logoUrl: z.string().trim().max(500),
  faviconUrl: z.string().trim().max(500),
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  contactEmail: z.string().trim().email().max(180),
  contactPhone: z.string().trim().max(40),
  whatsappNumber: z.string().trim().max(40),
  pixKey: z.string().trim().max(180),
  pixReceiverName: z.string().trim().min(1).max(80),
  pixReceiverCity: z.string().trim().min(1).max(60),
  orderExpirationMinutes: z.number().int().min(10).max(1440),
  allowPickup: z.boolean(),
  allowDelivery: z.boolean(),
  pickupInstructions: z.string().trim().min(1).max(1000),
  deliveryInstructions: z.string().trim().min(1).max(1000),
  minimumOrderValue: z.number().int().min(0),
  storeActive: z.boolean()
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
