import {
  getCatalogData,
  getFeaturedProducts,
  getProductBySlug,
  getProductStock
} from '../src/services/catalog-service';

describe('catalog-service', () => {
  it('filters products by category', () => {
    const catalog = getCatalogData({ category: 'livros' });

    expect(catalog.products).toHaveLength(2);
    expect(catalog.products.every((product) => product.categorySlug === 'livros')).toBe(
      true
    );
  });

  it('searches products by name', () => {
    const catalog = getCatalogData({ query: 'caneca' });

    expect(catalog.products).toHaveLength(1);
    expect(catalog.products[0].name).toBe('Caneca Dunamis');
  });

  it('sorts products by lower price first', () => {
    const catalog = getCatalogData({ sort: 'price_asc' });

    expect(catalog.products[0].name).toBe('Pulseira Dunamis');
  });

  it('finds a product by slug and calculates stock', () => {
    const product = getProductBySlug('camiseta-dunamis-classica');

    expect(product).toBeDefined();
    expect(product ? getProductStock(product) : 0).toBe(160);
  });

  it('returns featured products', () => {
    const featured = getFeaturedProducts();

    expect(featured.map((product) => product.name)).toEqual([
      'Camiseta Dunamis Classica',
      'Devocional 30 Dias'
    ]);
  });
});
