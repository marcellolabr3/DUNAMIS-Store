import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

import { ProductSection } from '../components/product-section';
import { useCart } from '../hooks/use-cart';
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
  const { addItem, lastAddedLineId } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const [quantity, setQuantity] = useState(1);

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

  const currentProduct = product;
  const mainImage = currentProduct.images.find((image) => image.isMain);
  const stock = getProductStock(currentProduct);
  const displayPrice = currentProduct.promotionalPrice ?? currentProduct.price;
  const relatedProducts = getRelatedProducts(currentProduct);
  const selectedVariant =
    currentProduct.variants.find((variant) => variant.id === selectedVariantId) ??
    currentProduct.variants[0];
  const selectedLineId = selectedVariant
    ? `${currentProduct.id}:${selectedVariant.id}`
    : undefined;
  const availableQuantity = selectedVariant?.stockQuantity ?? 0;
  const quantityOptions = Array.from(
    { length: Math.min(availableQuantity, 10) },
    (_, index) => index + 1
  );

  function handleAddToCart() {
    if (!selectedVariant || availableQuantity <= 0) {
      return;
    }

    addItem({
      productId: currentProduct.id,
      variantId: selectedVariant.id,
      quantity
    });
  }

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-md border border-border bg-surface p-4 shadow-sm">
          <div className="aspect-square overflow-hidden rounded bg-background">
            <img
              alt={mainImage?.altText ?? currentProduct.name}
              className="h-full w-full object-cover"
              src={mainImage?.url ?? '/demo/products/camiseta-classica.svg'}
            />
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div>
            <Link
              className="text-sm font-bold uppercase text-primary-hover"
              to={`/catalogo?categoria=${currentProduct.categorySlug}`}
            >
              {currentProduct.categoryName}
            </Link>
            <h1 className="mt-2 text-3xl font-black text-secondary sm:text-4xl">
              {currentProduct.name}
            </h1>
            <p className="mt-3 text-text-light">{currentProduct.shortDescription}</p>
          </div>

          <div className="rounded-md border border-border bg-surface p-4">
            <p className="text-3xl font-black text-secondary">
              {formatMoney(displayPrice)}
            </p>
            {currentProduct.promotionalPrice && (
              <p className="mt-1 text-sm text-text-light line-through">
                {formatMoney(currentProduct.price)}
              </p>
            )}
            <p className="mt-3 text-sm font-semibold text-text-light">
              SKU: {currentProduct.sku}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-light">
              Estoque total: {stock}
            </p>
          </div>

          <div className="grid gap-3">
            <h2 className="text-lg font-bold text-secondary">Variacoes</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {currentProduct.variants.map((variant) => (
                <button
                  className={`rounded-md border bg-surface p-3 text-left transition ${
                    selectedVariant?.id === variant.id
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border hover:border-primary'
                  }`}
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setQuantity(1);
                  }}
                  type="button"
                >
                  <p className="font-bold text-secondary">{variant.name}</p>
                  <p className="text-sm text-text-light">
                    {variant.stockQuantity} em estoque
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 rounded-md border border-border bg-surface p-4">
            <label className="grid gap-2 text-sm font-bold text-secondary">
              Quantidade
              <select
                className="h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
                disabled={availableQuantity <= 0}
                onChange={(event) => setQuantity(Number(event.target.value))}
                value={quantity}
              >
                {quantityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!selectedVariant || availableQuantity <= 0}
              onClick={handleAddToCart}
              type="button"
            >
              Adicionar ao carrinho
            </button>
            {selectedLineId === lastAddedLineId && (
              <p className="text-sm font-semibold text-success">
                Produto adicionado ao carrinho.
              </p>
            )}
          </div>

          <div className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-text-light">
            <p className="font-bold text-secondary">Retirada e pagamento</p>
            <p>Retirada na igreja conforme instrucoes do pedido.</p>
            <p>Pagamento inicial por Pix manual com envio de comprovante.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-secondary">Descricao</h2>
            <p className="mt-2 leading-7 text-text-light">
              {currentProduct.description}
            </p>
          </div>
        </div>
      </section>

      <ProductSection title="Produtos relacionados" products={relatedProducts} />
    </>
  );
}
