import { z } from 'zod';

const optionalText = z.string().trim().max(5000).optional().default('');
const moneyInCents = z.coerce.number().int().min(0).max(999_999_99);

export const adminProductVariantSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().min(1).max(120),
  sku: z.string().trim().min(1).max(80),
  size: z.string().trim().max(40).optional().default(''),
  color: z.string().trim().max(40).optional().default(''),
  priceAdjustment: z.coerce.number().int().min(-999_999).max(999_999).default(0),
  stockQuantity: z.coerce.number().int().min(0).max(999_999),
  active: z.coerce.boolean().default(true)
});

export const adminProductImageSchema = z.object({
  url: z.string().trim().min(1).max(1000),
  altText: z.string().trim().max(200).optional().default(''),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  isMain: z.coerce.boolean().default(false)
});

export const adminProductInputSchema = z.object({
  categoryId: z.string().trim().min(1),
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(180).optional().default(''),
  shortDescription: z.string().trim().min(1).max(280),
  description: optionalText,
  sku: z.string().trim().min(1).max(80),
  price: moneyInCents,
  promotionalPrice: moneyInCents.optional().nullable(),
  active: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
  trackStock: z.coerce.boolean().default(true),
  images: z.array(adminProductImageSchema).max(8).default([]),
  variants: z.array(adminProductVariantSchema).min(1).max(40)
});

export type AdminProductInput = z.infer<typeof adminProductInputSchema>;
