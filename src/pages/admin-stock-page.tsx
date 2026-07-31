import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Save, Search } from 'lucide-react';

import {
  getAdminProducts,
  setAdminProductActive,
  updateAdminProduct
} from '../services/admin-product-service';
import type {
  AdminCategoryOption,
  AdminProduct,
  AdminProductInput
} from '../types/admin-product';

export function AdminStockPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingProductId, setSavingProductId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getAdminProducts({ query, categoryId });

        if (!active) {
          return;
        }

        setProducts(data.products);
        setCategories(data.categories);
        setStockDrafts(buildStockDrafts(data.products));
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar o estoque.'
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [categoryId, query]);

  const groupedProducts = useMemo(() => groupByCategory(products), [products]);

  async function reload() {
    const data = await getAdminProducts({ query, categoryId });
    setProducts(data.products);
    setCategories(data.categories);
    setStockDrafts(buildStockDrafts(data.products));
  }

  async function saveProductStock(product: AdminProduct) {
    setSavingProductId(product.id);
    setMessage('');
    setError('');

    try {
      await updateAdminProduct(product.id, productToInput(product, stockDrafts));
      await reload();
      setMessage(`Estoque de ${product.name} atualizado.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Nao foi possivel salvar o estoque.'
      );
    } finally {
      setSavingProductId('');
    }
  }

  async function toggleProduct(product: AdminProduct) {
    setSavingProductId(product.id);
    setMessage('');
    setError('');

    try {
      await setAdminProductActive(product.id, !product.active);
      await reload();
      setMessage(product.active ? 'Produto desabilitado.' : 'Produto publicado.');
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'Nao foi possivel alterar o produto.'
      );
    } finally {
      setSavingProductId('');
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setQuery(String(formData.get('busca') ?? '').trim());
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Estoque</h2>
        <p className="mt-2 text-sm text-text-light">
          Liste produtos por categoria, ajuste quantidades e desabilite itens
          que nao devem aparecer na loja.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            error
              ? 'border-danger/30 bg-danger/10 text-danger'
              : 'border-success/30 bg-success/10 text-success'
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-3 rounded-md border border-border bg-surface p-4 md:grid-cols-[1fr_14rem]">
        <form className="relative" onSubmit={handleSearch}>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
            size={17}
          />
          <input
            className="w-full rounded-md border border-border py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
            defaultValue={query}
            name="busca"
            placeholder="Buscar produto ou SKU"
          />
        </form>
        <label>
          <span className="sr-only">Categoria</span>
          <select
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            onChange={(event) => setCategoryId(event.target.value)}
            value={categoryId}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <p className="rounded-md border border-border bg-surface p-6 text-sm text-text-light">
          Carregando estoque...
        </p>
      ) : groupedProducts.length === 0 ? (
        <p className="rounded-md border border-border bg-surface p-6 text-sm text-text-light">
          Nenhum produto encontrado.
        </p>
      ) : (
        groupedProducts.map((group) => (
          <section
            className="overflow-hidden rounded-md border border-border bg-surface"
            key={group.categoryName}
          >
            <div className="border-b border-border bg-background px-4 py-3">
              <h3 className="font-bold text-secondary">{group.categoryName}</h3>
            </div>
            <div className="divide-y divide-border">
              {group.products.map((product) => (
                <article
                  className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]"
                  key={product.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-secondary">{product.name}</h4>
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${
                          product.active
                            ? 'bg-success/10 text-success'
                            : 'bg-background text-text-light'
                        }`}
                      >
                        {product.active ? 'Publicado' : 'Inativo'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-light">
                      SKU {product.sku} | Estoque total {product.stockQuantity}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {product.variants.map((variant) => (
                        <label
                          className="grid gap-1 text-sm font-semibold text-secondary"
                          key={variant.id}
                        >
                          {variantLabel(variant)}
                          <input
                            className="input"
                            min="0"
                            onChange={(event) =>
                              setStockDrafts({
                                ...stockDrafts,
                                [variant.id ?? variant.sku]: Number(event.target.value)
                              })
                            }
                            type="number"
                            value={stockDrafts[variant.id ?? variant.sku] ?? 0}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 lg:justify-end">
                    <button
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-bold text-secondary hover:border-primary"
                      disabled={savingProductId === product.id}
                      onClick={() => void toggleProduct(product)}
                      type="button"
                    >
                      {product.active ? (
                        <EyeOff aria-hidden="true" size={16} />
                      ) : (
                        <Eye aria-hidden="true" size={16} />
                      )}
                      {product.active ? 'Desabilitar' : 'Publicar'}
                    </button>
                    <button
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-bold text-secondary hover:bg-primary-hover"
                      disabled={savingProductId === product.id}
                      onClick={() => void saveProductStock(product)}
                      type="button"
                    >
                      <Save aria-hidden="true" size={16} />
                      Salvar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  );
}

function buildStockDrafts(products: AdminProduct[]) {
  return products.reduce<Record<string, number>>((drafts, product) => {
    product.variants.forEach((variant) => {
      drafts[variant.id ?? variant.sku] = variant.stockQuantity;
    });

    return drafts;
  }, {});
}

function groupByCategory(products: AdminProduct[]) {
  const groups = new Map<string, AdminProduct[]>();

  products.forEach((product) => {
    const categoryName = product.categoryName || 'Sem categoria';
    groups.set(categoryName, [...(groups.get(categoryName) ?? []), product]);
  });

  return Array.from(groups, ([categoryName, groupProducts]) => ({
    categoryName,
    products: groupProducts
  })).sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}

function productToInput(
  product: AdminProduct,
  stockDrafts: Record<string, number>
): AdminProductInput {
  return {
    categoryId: product.categoryId,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    sku: product.sku,
    price: product.price,
    promotionalPrice: product.promotionalPrice,
    active: product.active,
    featured: product.featured,
    homeDisplayOrder: product.homeDisplayOrder,
    trackStock: product.trackStock,
    images: product.images,
    variants: product.variants.map((variant) => ({
      ...variant,
      size: variant.size || '',
      color: variant.color || '',
      stockQuantity: stockDrafts[variant.id ?? variant.sku] ?? variant.stockQuantity
    }))
  };
}

function variantLabel(variant: AdminProduct['variants'][number]) {
  const details = [variant.size, variant.color].filter(Boolean).join(' / ');

  return details ? `${variant.name} - ${details}` : variant.name;
}
