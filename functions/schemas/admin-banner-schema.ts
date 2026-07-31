import { z } from 'zod';

export const adminBannerSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(''),
  imageUrl: z.string().trim().min(1).max(1000),
  buttonLabel: z.string().trim().max(80).default(''),
  buttonLink: z.string().trim().max(500).default(''),
  active: z.coerce.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0)
});

export type AdminBannerInput = z.infer<typeof adminBannerSchema>;
