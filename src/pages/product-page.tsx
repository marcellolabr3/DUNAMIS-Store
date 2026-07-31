import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ProductSection } from '../components/product-section';
import { useCart } from '../hooks/use-cart';
import {
  getProductBySlug,
  getProductStock,
  getRelatedProducts
} from '../services/catalog-service';
import {
  getPublicCatalog,
  getPublicProduct
} from '../services/public-catalog-service';
import type { Product } from '../types/catalog';
import { formatMoney } from '../utils/money';

interface ProductRouteParams {
  slug: string;
}

const sizeOrder = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

export function ProductPage() {
  const { slug } = useParams<ProductRouteParams>();
  const { addItem, lastAddedLineId } = useCart();
  const fallbackProduct = getProductBySlug(slug);
  const [product, setProduct] = useState<Product | undefined>(fallbackProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(
    fallbackProduct ? getRelatedProducts(fallbackProduct) : []
  );
  const [isLoading, setIsLoading] = useState(!fallbackProduct);
  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      const nextFallbackProduct = getProductBySlug(slug);
      setProduct(nextFallbackProduct);
      setRelatedProducts(
        nextFallbackProduct ? getRelatedProducts(nextFallbackProduct) : []
      );
      setIsLoading(!nextFallbackProduct);
      setSelectedVariantId(undefined);
      setSelectedSize(undefined);
      setSelectedColor(undefined);
      setSelectedImageUrl(undefined);
      setQuantity(1);

      try {
        const loadedProduct = await getPublicProduct(slug);

        if (!active) {
          return;
        }

        setProduct(loadedProduct);
        setSelectedImageUrl(
          loadedProduct?.images.find((image) => image.isMain)?.url ??
            loadedProduct?.images[0]?.url
        );

        if (loadedProduct) {
          const catalog = await getPublicCatalog({
            category: loadedProduct.categorySlug
          });

          if (active) {
            setRelatedProducts(
              catalog.products
                .filter((item) => item.id !== loadedProduct.id)
                .slice(0, 4)
            );
          }
        } else {
          setRelatedProducts([]);
        }
      } catch {
        if (active) {
          setProduct(undefined);
          setRelatedProducts([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <section className="mx-auto grid min-h-[50vh] max-w-4xl content-center gap-4 px-4 py-16">
        <h1 className="text-3xl font-black text-secondary">Carregando produto</h1>
      </section>
    );
  }

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
  const displayedImageUrl =
    selectedImageUrl ?? mainImage?.url ?? currentProduct.images[0]?.url;
  const stock = getProductStock(currentProduct);
  const displayPrice = currentProduct.promotionalPrice ?? currentProduct.price;
  const activeVariants = currentProduct.variants.filter(
    (variant) => variant.stockQuantity > 0
  );
  const sizes = uniqueValues(currentProduct.variants.map((variant) => variant.size));
  const resolvedSize = selectedSize ?? sizes[0];
  const colors = uniqueValues(
    currentProduct.variants
      .filter((variant) => !sizes.length || variant.size === resolvedSize)
      .map((variant) => variant.color)
  );
  const resolvedColor =
    selectedColor && colors.includes(selectedColor) ? selectedColor : colors[0];
  const selectedVariant =
    currentProduct.variants.find((variant) => variant.id === selectedVariantId) ??
    activeVariants.find(
      (variant) =>
        (!sizes.length || variant.size === resolvedSize) &&
        (!colors.length || variant.color === resolvedColor)
    ) ??
    activeVariants[0] ??
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
              className="h-full w-full object-contain"
              src={displayedImageUrl ?? '/demo/products/camiseta-classica.svg'}
            />
          </div>
          {currentProduct.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {currentProduct.images.map((image) => (
                <button
                  className={`aspect-square overflow-hidden rounded-md border ${
                    displayedImageUrl === image.url
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border'
                  }`}
                  key={image.id}
                  onClick={() => setSelectedImageUrl(image.url)}
                  type="button"
                >
                  <img
                    alt={image.altText || currentProduct.name}
                    className="h-full w-full object-contain"
                    src={image.url}
                  />
                </button>
              ))}
            </div>
          )}
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
            {sizes.length > 0 && (
              <OptionGroup
                label="Tamanho"
                options={sizes}
                selectedValue={resolvedSize}
                onSelect={(value) => {
                  const nextColors = uniqueValues(
                    currentProduct.variants
                      .filter((variant) => variant.size === value)
                      .map((variant) => variant.color)
                  );
                  setSelectedSize(value);
                  setSelectedColor(nextColors[0]);
                  setQuantity(1);
                  setSelectedVariantId(undefined);
                }}
              />
            )}
            {colors.length > 0 && (
              <OptionGroup
                label="Cor"
                options={colors}
                selectedValue={resolvedColor}
                onSelect={(value) => {
                  setSelectedColor(value);
                  setSelectedVariantId(undefined);
                  setQuantity(1);
                }}
              />
            )}
            {sizes.length === 0 && colors.length === 0 && (
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
            )}
            <p className="text-sm font-semibold text-text-light">
              {selectedVariant
                ? `${selectedVariant.stockQuantity} em estoque`
                : 'Selecione uma variacao disponivel.'}
            </p>
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

function uniqueValues(values: Array<string | undefined>) {
  const unique = Array.from(
    new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])
  );

  return unique.sort((first, second) => {
    const firstIndex = sizeOrder.indexOf(first.toUpperCase());
    const secondIndex = sizeOrder.indexOf(second.toUpperCase());

    if (firstIndex !== -1 || secondIndex !== -1) {
      return (
        (firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex) -
        (secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex)
      );
    }

    return first.localeCompare(second);
  });
}

function OptionGroup({
  label,
  onSelect,
  options,
  selectedValue
}: {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  selectedValue?: string;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-bold text-secondary">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            className={`min-h-10 rounded-md border px-4 text-sm font-bold ${
              selectedValue === option
                ? 'border-primary bg-primary/20 text-secondary'
                : 'border-border bg-surface text-text-light hover:border-primary'
            }`}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
