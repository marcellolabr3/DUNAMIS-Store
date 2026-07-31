export interface AdminCategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProductImage {
  id?: string;
  url: string;
  altText: string;
  displayOrder: number;
  isMain: boolean;
}

export interface AdminProductVariant {
  id?: string;
  name: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceAdjustment: number;
  stockQuantity: number;
  active: boolean;
}

export interface AdminProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  price: number;
  promotionalPrice: number | null;
  active: boolean;
  featured: boolean;
  homeDisplayOrder: number;
  trackStock: boolean;
  createdAt: string;
  updatedAt: string;
  stockQuantity: number;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
}

export interface AdminProductInput {
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  price: number;
  promotionalPrice: number | null;
  active: boolean;
  featured: boolean;
  homeDisplayOrder: number;
  trackStock: boolean;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
}
