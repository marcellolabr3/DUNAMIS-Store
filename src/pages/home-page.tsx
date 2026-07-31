import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProductSection } from '../components/product-section';
import {
  demoBanners,
  demoCategories,
  demoProducts
} from '../services/demo-catalog-data';
import { getPublicHome } from '../services/public-catalog-service';
import {
  type PublicStoreSettings,
  getPublicSettings
} from '../services/public-settings-service';
import type { Banner, Category, Product } from '../types/catalog';

export function HomePage() {
  const [banners, setBanners] = useState<Banner[]>(demoBanners);
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [settings, setSettings] = useState<PublicStoreSettings>();
  const [isLoading, setIsLoading] = useState(true);
  const [promotionDismissed, setPromotionDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const [data, loadedSettings] = await Promise.all([
          getPublicHome(),
          getPublicSettings()
        ]);

        if (!active) {
          return;
        }

        setBanners(data.banners);
        setCategories(data.categories);
        setProducts(data.products);
        setSettings(loadedSettings);
      } catch {
        if (active) {
          setBanners([]);
          setCategories([]);
          setProducts([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadHome();

    return () => {
      active = false;
    };
  }, []);

  const [mainBanner] = banners;
  const featuredProducts = products
    .filter((product) => product.featured)
    .sort(
      (a, b) =>
        (a.homeDisplayOrder ?? 0) - (b.homeDisplayOrder ?? 0) ||
        b.createdAt.localeCompare(a.createdAt)
    )
    .slice(0, 4);
  const promotionProduct = featuredProducts.find(
    (product) => product.promotionalPrice
  );
  const bannerAspectClass = getBannerAspectClass(mainBanner?.aspectRatio);
  const bannerFitClass =
    mainBanner?.imageFit === 'contain' ? 'object-contain' : 'object-cover';

  if (mainBanner?.layoutMode === 'full') {
    return (
      <>
        <section
          className="relative border-b border-border"
          style={{ backgroundColor: mainBanner.backgroundColor || '#FFFFFF' }}
        >
          <img
            alt={mainBanner.title}
            className={`w-full ${bannerAspectClass} ${bannerFitClass} object-center`}
            src={mainBanner.imageUrl}
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 mx-auto grid max-w-6xl content-center px-4 py-10">
            <div className="max-w-2xl space-y-4" style={{ color: mainBanner.textColor || '#FFFFFF' }}>
              <p className="w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
                Loja virtual da igreja
              </p>
              <h1 className="text-4xl font-black sm:text-5xl">
                {settings?.storeName || 'DUNAMIS STORE'}
              </h1>
              <p className="text-lg leading-8">
                {settings?.storeDescription ||
                  'Produtos da igreja com catalogo simples, retirada local e pagamento inicial por Pix manual.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-secondary transition hover:bg-primary-hover"
                  to="/catalogo"
                >
                  Ver catalogo
                </Link>
                <Link
                  className="rounded-md border border-white/70 bg-black/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-black/35"
                  to="/pedido"
                >
                  Acompanhar pedido
                </Link>
              </div>
            </div>
          </div>
        </section>

        <StorefrontSections
          categories={categories}
          featuredProducts={featuredProducts}
          promotionDismissed={promotionDismissed}
          promotionProduct={promotionProduct}
          setPromotionDismissed={setPromotionDismissed}
          settings={settings}
        />
      </>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid min-h-[66vh] max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <p className="w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
              Loja virtual da igreja
            </p>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-black text-secondary sm:text-5xl">
                {settings?.storeName || 'DUNAMIS STORE'}
              </h1>
              <p className="text-lg leading-8 text-text-light">
                {settings?.storeDescription ||
                  'Produtos da igreja com catalogo simples, retirada local e pagamento inicial por Pix manual.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-md bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-text"
                to="/catalogo"
              >
                Ver catalogo
              </Link>
              <Link
                className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-bold text-secondary transition hover:border-primary hover:bg-primary/10"
                to="/pedido"
              >
                Acompanhar pedido
              </Link>
            </div>
          </div>

          {mainBanner ? (
            <Link
              className="block overflow-hidden rounded-md border border-border bg-background shadow-sm"
              to={mainBanner.buttonLink || '/catalogo'}
            >
              <img
                alt={mainBanner.title}
                className={`${bannerAspectClass} h-full w-full ${bannerFitClass} object-center`}
                style={{ backgroundColor: mainBanner.backgroundColor }}
                src={mainBanner.imageUrl}
              />
            </Link>
          ) : (
            <div className={`grid ${bannerAspectClass} place-items-center rounded-md border border-border bg-background p-6 text-center text-sm font-semibold text-text-light shadow-sm`}>
              {isLoading ? 'Carregando loja...' : 'Banner principal'}
            </div>
          )}
        </div>
      </section>

      <StorefrontSections
        categories={categories}
        featuredProducts={featuredProducts}
        promotionDismissed={promotionDismissed}
        promotionProduct={promotionProduct}
        setPromotionDismissed={setPromotionDismissed}
        settings={settings}
      />
    </>
  );
}

function StorefrontSections({
  categories,
  featuredProducts,
  promotionDismissed,
  promotionProduct,
  setPromotionDismissed,
  settings
}: {
  categories: Category[];
  featuredProducts: Product[];
  promotionDismissed: boolean;
  promotionProduct?: Product;
  setPromotionDismissed: (dismissed: boolean) => void;
  settings?: { storeDescription: string; pickupInstructions: string };
}) {
  return (
    <>
      <ProductSection title="Produtos em destaque" products={featuredProducts} />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5">
          <h2 className="text-2xl font-black text-secondary">
            Categorias em destaque
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              className="overflow-hidden rounded-md border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-primary"
              key={category.id}
              to={`/catalogo?categoria=${category.slug}`}
            >
              <img
                alt={category.name}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                src={category.imageUrl}
              />
              <div className="p-3">
                <h3 className="font-bold text-secondary">{category.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-text-light">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
          <InfoBlock
            title="Conheca a loja"
            text={
              settings?.storeDescription ||
              'A DUNAMIS STORE centraliza produtos da igreja em uma experiencia simples para celular e desktop.'
            }
          />
          <InfoBlock
            title="Retirada"
            text={
              settings?.pickupInstructions ||
              'A retirada inicial e feita na igreja, conforme as instrucoes exibidas no pedido.'
            }
          />
          <InfoBlock
            title="Pagamento"
            text="O pagamento inicial usa Pix manual. O comprovante sera conferido por um administrador."
          />
        </div>
      </section>

      {promotionProduct && !promotionDismissed && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4">
          <section className="relative grid w-full max-w-md gap-4 rounded-md border border-border bg-surface p-5 shadow-xl">
            <button
              aria-label="Fechar promocao"
              className="absolute right-3 top-3 inline-grid size-9 place-items-center rounded-md border border-border text-text-light hover:text-secondary"
              onClick={() => setPromotionDismissed(true)}
              type="button"
            >
              <X aria-hidden="true" size={17} />
            </button>
            <p className="w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
              Promocao
            </p>
            <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
              <img
                alt={promotionProduct.name}
                className="aspect-square w-full rounded-md bg-background object-cover"
                src={
                  promotionProduct.images.find((image) => image.isMain)?.url ??
                  promotionProduct.images[0]?.url ??
                  '/demo/products/camiseta-classica.svg'
                }
              />
              <div>
                <h2 className="pr-8 text-xl font-black text-secondary">
                  {promotionProduct.name}
                </h2>
                <p className="mt-2 text-sm text-text-light">
                  Produto selecionado em destaque na loja.
                </p>
              </div>
            </div>
            <Link
              className="flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover"
              onClick={() => setPromotionDismissed(true)}
              to={`/produto/${promotionProduct.slug}`}
            >
              Ver promocao
            </Link>
          </section>
        </div>
      )}
    </>
  );
}

function getBannerAspectClass(aspectRatio?: Banner['aspectRatio']) {
  switch (aspectRatio) {
    case '21/9':
      return 'aspect-[21/9]';
    case '4/3':
      return 'aspect-[4/3]';
    case '1/1':
      return 'aspect-square';
    case '16/7':
    default:
      return 'aspect-[16/7]';
  }
}

interface InfoBlockProps {
  title: string;
  text: string;
}

function InfoBlock({ title, text }: InfoBlockProps) {
  return (
    <article>
      <h2 className="text-lg font-black text-secondary">{title}</h2>
      <p className="mt-2 leading-6 text-text-light">{text}</p>
    </article>
  );
}
