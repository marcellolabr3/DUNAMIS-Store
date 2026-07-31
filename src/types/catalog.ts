export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  size?: string;
  color?: string;
  priceAdjustment: number;
  stockQuantity: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  displayOrder: number;
  isMain: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  price: number;
  promotionalPrice?: number;
  active: boolean;
  featured: boolean;
  homeDisplayOrder?: number;
  trackStock: boolean;
  createdAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  buttonLink: string;
  displayOrder: number;
}

export type CatalogSort = 'recent' | 'price_asc' | 'price_desc';

export interface CatalogFilters {
  category?: string;
  query?: string;
  sort?: CatalogSort;
}
