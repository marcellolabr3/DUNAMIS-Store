import {
  demoBanners,
  demoCategories,
  demoProducts
} from './demo-catalog-data';
import type {
  Banner,
  CatalogFilters,
  Category,
  Product
} from '../types/catalog';

export interface CatalogData {
  banners: Banner[];
  categories: Category[];
  products: Product[];
}

export function getCatalogData(filters: CatalogFilters = {}): CatalogData {
  return {
    banners: demoBanners,
    categories: demoCategories,
    products: filterProducts(demoProducts, filters)
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  return demoProducts.find((product) => product.slug === slug && product.active);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return demoProducts
    .filter(
      (item) =>
        item.id !== product.id &&
        item.active &&
        item.categorySlug === product.categorySlug
    )
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return demoProducts.filter((product) => product.featured).slice(0, limit);
}

export function getRecentProducts(limit = 4): Product[] {
  return [...demoProducts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getProductStock(product: Product) {
  return product.variants.reduce(
    (total, variant) => total + variant.stockQuantity,
    0
  );
}

function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const normalizedQuery = filters.query?.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      !filters.category || product.categorySlug === filters.category;
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.shortDescription.toLowerCase().includes(normalizedQuery);

    return product.active && matchesCategory && matchesQuery;
  });

  switch (filters.sort) {
    case 'price_asc':
      return [...filtered].sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    case 'price_desc':
      return [...filtered].sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    case 'recent':
    default:
      return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

function getDisplayPrice(product: Product) {
  return product.promotionalPrice ?? product.price;
}
