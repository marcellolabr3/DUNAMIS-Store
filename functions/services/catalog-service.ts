import { CatalogRepository } from '../repositories/catalog-repository';
import type {
  ProductImageRow,
  ProductRow,
  ProductVariantRow
} from '../types/catalog';

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async getHome() {
    const [categories, banners, products] = await Promise.all([
      this.repository.getCategories(),
      this.repository.getBanners(),
      this.repository.getProducts({
        featuredOnly: true,
        homeOrder: true,
        limit: 48
      })
    ]);

    return {
      categories: categories.results.map(mapCategory),
      banners: banners.results.map(mapBanner),
      products: await this.hydrateProducts(products.results)
    };
  }

  async getCategories() {
    const categories = await this.repository.getCategories();

    return categories.results.map(mapCategory);
  }

  async getProducts(filters: {
    category?: string;
    query?: string;
    sort?: string;
  }) {
    const products = await this.repository.getProducts(filters);

    return this.hydrateProducts(products.results);
  }

  async getProduct(slug: string) {
    const product = await this.repository.getProductBySlug(slug);

    if (!product) {
      return undefined;
    }

    const [hydrated] = await this.hydrateProducts([product]);

    return hydrated;
  }

  private async hydrateProducts(products: ProductRow[]) {
    const productIds = products.map((product) => product.id);
    const [images, variants] = await Promise.all([
      this.repository.getImages(productIds),
      this.repository.getVariants(productIds)
    ]);

    return products.map((product) =>
      mapProduct(product, images.results, variants.results)
    );
  }
}

function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    displayOrder: row.display_order
  };
}

function mapBanner(row: {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_label: string;
  button_link: string;
  display_order: number;
  layout_mode: string;
  aspect_ratio: string;
  image_fit: string;
  background_color: string;
  text_color: string;
}) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    buttonLabel: row.button_label,
    buttonLink: row.button_link,
    displayOrder: row.display_order,
    layoutMode: row.layout_mode as 'split' | 'full',
    aspectRatio: row.aspect_ratio as '16/7' | '21/9' | '4/3' | '1/1',
    imageFit: row.image_fit as 'cover' | 'contain',
    backgroundColor: row.background_color,
    textColor: row.text_color
  };
}

function mapProduct(
  row: ProductRow,
  images: ProductImageRow[],
  variants: ProductVariantRow[]
) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    sku: row.sku,
    price: row.price,
    promotionalPrice: row.promotional_price ?? undefined,
    active: row.active === 1,
    featured: row.featured === 1,
    homeDisplayOrder: row.home_display_order,
    trackStock: row.track_stock === 1,
    createdAt: row.created_at,
    images: images
      .filter((image) => image.product_id === row.id)
      .map((image) => ({
        id: image.id,
        productId: image.product_id,
        url: image.url,
        altText: image.alt_text,
        displayOrder: image.display_order,
        isMain: image.is_main === 1
      })),
    variants: variants
      .filter((variant) => variant.product_id === row.id)
      .map((variant) => ({
        id: variant.id,
        productId: variant.product_id,
        name: variant.name,
        sku: variant.sku,
        size: variant.size ?? undefined,
        color: variant.color ?? undefined,
        priceAdjustment: variant.price_adjustment,
        stockQuantity: variant.stock_quantity
      }))
  };
}
