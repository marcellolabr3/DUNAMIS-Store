import { Link, useParams } from 'react-router-dom';

import { ProductSection } from '../components/product-section';
import {
  getProductBySlug,
  getProductStock,
  getRelatedProducts
} from '../services/catalog-service';
import { formatMoney } from '../utils/money';

interface ProductRouteParams {
  slug: string;
}

export function ProductPage() {
  const { slug } = useParams<ProductRouteParams>();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <section className="mx-auto grid min-h-[50vh] max-w-4xl content-center gap-4 px-4 py-16">
        <h1 className="text-3xl font-black text-secondary">
          Produto nao encontrado
        </h1>
        <Link className="font-bold text-primary-hover" to="/catalogo">
          Voltar ao catalogo
        </Link>
      </section>
    );
  }

  const mainImage = product.images.find((image) => image.isMain);
  const stock = getProductStock(product);
  const displayPrice = product.promotionalPrice ?? product.price;
  const relatedProducts = getRelatedProducts(product);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-md border border-border bg-surface p-4 shadow-sm">
          <div className="aspect-square overflow-hidden rounded bg-background">
            <img
              alt={mainImage?.altText ?? product.name}
              className="h-full w-full object-cover"
              src={mainImage?.url ?? '/demo/products/camiseta-classica.svg'}
            />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div>
            <Link
              className="text-sm font-bold uppercase text-primary-hover"
              to={`/catalogo?categoria=${product.categorySlug}`}
            >
              {product.categoryName}
            </Link>
            <h1 className="mt-2 text-3xl font-black text-secondary sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-text-light">{product.shortDescription}</p>
          </div>

          <div className="rounded-md border border-border bg-surface p-4">
            <p className="text-3xl font-black text-secondary">
              {formatMoney(displayPrice)}
            </p>
            {product.promotionalPrice && (
              <p className="mt-1 text-sm text-text-light line-through">
                {formatMoney(product.price)}
              </p>
            )}
            <p className="mt-3 text-sm font-semibold text-text-light">
              SKU: {product.sku}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-light">
              Estoque total: {stock}
            </p>
          </div>

          <div className="grid gap-3">
            <h2 className="text-lg font-bold text-secondary">Variacoes</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {product.variants.map((variant) => (
                <div
                  className="rounded-md border border-border bg-surface p-3"
                  key={variant.id}
                >
                  <p className="font-bold text-secondary">{variant.name}</p>
                  <p className="text-sm text-text-light">
                    {variant.stockQuantity} em estoque
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-text-light">
            <p className="font-bold text-secondary">Retirada e pagamento</p>
            <p>Retirada na igreja conforme instrucoes do pedido.</p>
            <p>Pagamento inicial por Pix manual com envio de comprovante.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-secondary">Descricao</h2>
            <p className="mt-2 leading-7 text-text-light">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      <ProductSection title="Produtos relacionados" products={relatedProducts} />
    </>
  );
}
