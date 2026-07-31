import { Link } from 'react-router-dom';

import { getProductStock } from '../services/catalog-service';
import type { Product } from '../types/catalog';
import { formatMoney } from '../utils/money';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((image) => image.isMain);
  const stock = getProductStock(product);
  const displayPrice = product.promotionalPrice ?? product.price;

  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-sm">
      <Link className="block" to={`/produto/${product.slug}`}>
        <div className="aspect-square bg-background">
          <img
            alt={mainImage?.altText ?? product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            src={mainImage?.url ?? '/demo/products/camiseta-classica.svg'}
          />
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-primary-hover">
            {product.categoryName}
          </p>
          <h3 className="mt-1 min-h-12 text-base font-bold text-secondary">
            <Link className="hover:text-primary-hover" to={`/produto/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-text-light">
          {product.shortDescription}
        </p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-secondary">
              {formatMoney(displayPrice)}
            </p>
            {product.promotionalPrice && (
              <p className="text-xs text-text-light line-through">
                {formatMoney(product.price)}
              </p>
            )}
          </div>
          <span
            className={`rounded px-2 py-1 text-xs font-bold ${
              stock > 0
                ? 'bg-primary/20 text-secondary'
                : 'bg-danger/10 text-danger'
            }`}
          >
            {stock > 0 ? `${stock} em estoque` : 'Sem estoque'}
          </span>
        </div>
      </div>
    </article>
  );
}
