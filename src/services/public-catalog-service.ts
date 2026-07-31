import type { Banner, CatalogFilters, Category, Product } from '../types/catalog';
import {
  demoBanners,
  demoCategories,
  demoProducts
} from './demo-catalog-data';
import { getCatalogData } from './catalog-service';

export interface PublicHomeData {
  banners: Banner[];
  categories: Category[];
  products: Product[];
}

export interface PublicCatalogData {
  categories: Category[];
  products: Product[];
}

export async function getPublicHome(): Promise<PublicHomeData> {
  try {
    const response = await fetch('/api/home');

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a loja.');
    }

    const payload = (await response.json()) as Partial<PublicHomeData>;

    if (!Array.isArray(payload.products)) {
      throw new Error('Resposta invalida.');
    }

    return {
      banners: Array.isArray(payload.banners) ? payload.banners : demoBanners,
      categories: Array.isArray(payload.categories)
        ? payload.categories
        : demoCategories,
      products: payload.products
    };
  } catch {
    return {
      banners: demoBanners,
      categories: demoCategories,
      products: demoProducts
    };
  }
}

export async function getPublicCatalog(
  filters: CatalogFilters = {}
): Promise<PublicCatalogData> {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set('categoria', filters.category);
  }

  if (filters.query) {
    params.set('busca', filters.query);
  }

  if (filters.sort) {
    params.set('ordem', filters.sort);
  }

  try {
    const response = await fetch(`/api/catalog?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o catalogo.');
    }

    const payload = (await response.json()) as Partial<PublicCatalogData>;

    if (!Array.isArray(payload.products)) {
      throw new Error('Resposta invalida.');
    }

    return {
      categories: Array.isArray(payload.categories)
        ? payload.categories
        : demoCategories,
      products: payload.products
    };
  } catch {
    const fallback = getCatalogData(filters);

    return {
      categories: fallback.categories,
      products: fallback.products
    };
  }
}

export async function getPublicProduct(slug: string) {
  try {
    const response = await fetch(`/api/product/${slug}`);

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as { product?: Product };

    return payload.product;
  } catch {
    return demoProducts.find((product) => product.slug === slug && product.active);
  }
}
