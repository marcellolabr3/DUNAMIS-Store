import { FormEvent } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { ProductCard } from '../components/product-card';
import { getCatalogData } from '../services/catalog-service';
import type { CatalogSort } from '../types/catalog';

export function CatalogPage() {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get('categoria') ?? '';
  const query = params.get('busca') ?? '';
  const sort = (params.get('ordem') as CatalogSort | null) ?? 'recent';
  const { categories, products } = getCatalogData({
    category: selectedCategory || undefined,
    query,
    sort
  });

  function updateSearch(nextParams: URLSearchParams) {
    history.push({
      pathname: '/catalogo',
      search: nextParams.toString()
    });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams(location.search);
    const nextQuery = String(formData.get('busca') ?? '').trim();

    if (nextQuery) {
      nextParams.set('busca', nextQuery);
    } else {
      nextParams.delete('busca');
    }

    updateSearch(nextParams);
  }

  function handleCategory(category: string) {
    const nextParams = new URLSearchParams(location.search);

    if (category) {
      nextParams.set('categoria', category);
    } else {
      nextParams.delete('categoria');
    }

    updateSearch(nextParams);
  }

  function handleSort(nextSort: string) {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set('ordem', nextSort);
    updateSearch(nextParams);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-primary-hover">
            Catalogo
          </p>
          <h1 className="mt-2 text-3xl font-black text-secondary">
            Produtos DUNAMIS STORE
          </h1>
          <p className="mt-2 text-text-light">
            Produtos ficticios para visualizar a loja antes do cadastro real.
          </p>
        </div>
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            className="h-11 min-w-0 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
            defaultValue={query}
            name="busca"
            placeholder="Buscar produto"
            type="search"
          />
          <button
            className="h-11 rounded-md bg-secondary px-4 text-sm font-bold text-white hover:bg-text"
            type="submit"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            className={`shrink-0 rounded-md border px-3 py-2 text-sm font-bold ${
              !selectedCategory
                ? 'border-primary bg-primary text-secondary'
                : 'border-border bg-surface text-text-light'
            }`}
            onClick={() => handleCategory('')}
            type="button"
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              className={`shrink-0 rounded-md border px-3 py-2 text-sm font-bold ${
                selectedCategory === category.slug
                  ? 'border-primary bg-primary text-secondary'
                  : 'border-border bg-surface text-text-light'
              }`}
              key={category.id}
              onClick={() => handleCategory(category.slug)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-text-light">
          Ordenar
          <select
            className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
            onChange={(event) => handleSort(event.target.value)}
            value={sort}
          >
            <option value="recent">Mais recentes</option>
            <option value="price_asc">Menor preco</option>
            <option value="price_desc">Maior preco</option>
          </select>
        </label>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-bold text-secondary">
            Nenhum produto encontrado
          </h2>
          <p className="mt-2 text-text-light">
            Ajuste a busca ou escolha outra categoria.
          </p>
          <Link
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-bold text-secondary hover:bg-primary-hover"
            to="/catalogo"
          >
            Limpar filtros
          </Link>
        </div>
      )}
    </section>
  );
}
