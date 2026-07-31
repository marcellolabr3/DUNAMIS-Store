import { adminProductInputSchema } from '../functions/schemas/admin-product-schema';
import { slugify } from '../functions/services/admin-product-service';

describe('admin product service helpers', () => {
  it('generates stable product slugs', () => {
    expect(slugify('Camiseta Dunamis Classica')).toBe(
      'camiseta-dunamis-classica'
    );
    expect(slugify('  Devocional 30 Dias!!!  ')).toBe('devocional-30-dias');
  });

  it('validates product input with at least one variant', () => {
    const product = adminProductInputSchema.parse({
      categoryId: 'demo-category-shirts',
      name: 'Produto Teste',
      shortDescription: 'Produto para teste',
      sku: 'TESTE-001',
      price: 6990,
      active: true,
      featured: false,
      trackStock: true,
      variants: [
        {
          name: 'P',
          sku: 'TESTE-001-P',
          stockQuantity: 10
        }
      ]
    });

    expect(product.price).toBe(6990);
    expect(product.variants[0].active).toBe(true);
  });

  it('rejects products without variants', () => {
    expect(() =>
      adminProductInputSchema.parse({
        categoryId: 'demo-category-shirts',
        name: 'Produto sem estoque',
        shortDescription: 'Invalido',
        sku: 'TESTE-SEM-VARIANTE',
        price: 1000,
        variants: []
      })
    ).toThrow();
  });
});
