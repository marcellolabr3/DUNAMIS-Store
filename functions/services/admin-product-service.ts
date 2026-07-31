import { AdminProductRepository } from '../repositories/admin-product-repository';
import {
  type AdminProductInput,
  adminProductInputSchema
} from '../schemas/admin-product-schema';
import type {
  AdminCategoryRow,
  AdminProductImageRow,
  AdminProductRow,
  AdminProductVariantRow
} from '../types/admin-product';

export class AdminProductService {
  constructor(private readonly repository: AdminProductRepository) {}

  async list(filters: { query?: string; categoryId?: string }) {
    const [categories, products] = await Promise.all([
      this.repository.getCategories(),
      this.repository.getProducts(filters)
    ]);
    const productIds = products.results.map((product) => product.id);
    const [images, variants] = await Promise.all([
      this.repository.getImages(productIds),
      this.repository.getVariants(productIds)
    ]);

    return {
      categories: categories.results.map(mapCategory),
      products: products.results.map((product) =>
        mapProduct(product, images.results, variants.results)
      )
    };
  }

  async create(input: unknown) {
    const parsed = normalizeProductInput(adminProductInputSchema.parse(input));
    const id = crypto.randomUUID();
    const slug = parsed.slug || slugify(parsed.name);

    await this.repository.createProduct({ ...parsed, id, slug });

    return this.getById(id);
  }

  async update(id: string, input: unknown) {
    const parsed = normalizeProductInput(adminProductInputSchema.parse(input));
    const existing = await this.repository.getProductById(id);

    if (!existing) {
      return undefined;
    }

    await this.repository.updateProduct(id, {
      ...parsed,
      slug: parsed.slug || slugify(parsed.name)
    });

    return this.getById(id);
  }

  async duplicate(id: string) {
    const product = await this.getById(id);

    if (!product) {
      return undefined;
    }

    const copyName = `${product.name} copia`;
    const copySku = `${product.sku}-COPY-${Date.now().toString().slice(-4)}`;
    const input: AdminProductInput = {
      categoryId: product.categoryId,
      name: copyName,
      slug: `${product.slug}-copia-${Date.now().toString().slice(-4)}`,
      shortDescription: product.shortDescription,
      description: product.description,
      sku: copySku,
      price: product.price,
      promotionalPrice: product.promotionalPrice,
      active: false,
      featured: product.featured,
      trackStock: product.trackStock,
      images: product.images.map((image) => ({
        url: image.url,
        altText: image.altText,
        displayOrder: image.displayOrder,
        isMain: image.isMain
      })),
      variants: product.variants.map((variant, index) => ({
        name: variant.name,
        sku: `${variant.sku}-COPY-${Date.now().toString().slice(-4)}-${index + 1}`,
        size: variant.size ?? '',
        color: variant.color ?? '',
        priceAdjustment: variant.priceAdjustment,
        stockQuantity: variant.stockQuantity,
        active: variant.active
      }))
    };

    return this.create(input);
  }

  async setActive(id: string, active: boolean) {
    const existing = await this.repository.getProductById(id);

    if (!existing) {
      return undefined;
    }

    await this.repository.setProductActive(id, active);

    return this.getById(id);
  }

  async softDelete(id: string) {
    const existing = await this.repository.getProductById(id);

    if (!existing) {
      return false;
    }

    await this.repository.softDeleteProduct(id);

    return true;
  }

  private async getById(id: string) {
    const product = await this.repository.getProductById(id);

    if (!product) {
      return undefined;
    }

    const [images, variants] = await Promise.all([
      this.repository.getImages([id]),
      this.repository.getVariants([id])
    ]);

    return mapProduct(product, images.results, variants.results);
  }
}

function normalizeProductInput(input: AdminProductInput): AdminProductInput {
  const images = input.images.map((image, index) => ({
    ...image,
    displayOrder: image.displayOrder || index,
    isMain: image.isMain || index === 0
  }));

  return {
    ...input,
    slug: input.slug ? slugify(input.slug) : '',
    promotionalPrice: input.promotionalPrice || null,
    images
  };
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function mapCategory(row: AdminCategoryRow) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug
  };
}

function mapProduct(
  row: AdminProductRow,
  images: AdminProductImageRow[],
  variants: AdminProductVariantRow[]
) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    sku: row.sku,
    price: row.price,
    promotionalPrice: row.promotional_price,
    active: row.active === 1,
    featured: row.featured === 1,
    trackStock: row.track_stock === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stockQuantity: variants
      .filter((variant) => variant.active === 1)
      .reduce((total, variant) => total + variant.stock_quantity, 0),
    images: images
      .filter((image) => image.product_id === row.id)
      .map((image) => ({
        id: image.id,
        url: image.url,
        altText: image.alt_text,
        displayOrder: image.display_order,
        isMain: image.is_main === 1
      })),
    variants: variants
      .filter((variant) => variant.product_id === row.id)
      .map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        priceAdjustment: variant.price_adjustment,
        stockQuantity: variant.stock_quantity,
        active: variant.active === 1
      }))
  };
}
