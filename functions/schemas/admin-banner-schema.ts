import { z } from 'zod';

export const adminBannerSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(''),
  imageUrl: z.string().trim().min(1).max(1000),
  buttonLabel: z.string().trim().max(80).default(''),
  buttonLink: z.string().trim().max(500).default(''),
  active: z.coerce.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  layoutMode: z.enum(['split', 'full']).default('split'),
  aspectRatio: z.enum(['16/7', '21/9', '4/3', '1/1']).default('16/7'),
  imageFit: z.enum(['cover', 'contain']).default('cover'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#171717')
});

export type AdminBannerInput = z.infer<typeof adminBannerSchema>;
