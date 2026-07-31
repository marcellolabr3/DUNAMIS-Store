import { Link } from 'react-router-dom';

import { ProductSection } from '../components/product-section';
import {
  demoBanners,
  demoCategories
} from '../services/demo-catalog-data';
import {
  getFeaturedProducts,
  getRecentProducts
} from '../services/catalog-service';

export function HomePage() {
  const [mainBanner] = demoBanners;
  const featuredProducts = getFeaturedProducts();
  const recentProducts = getRecentProducts();

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
                DUNAMIS STORE
              </h1>
              <p className="text-lg leading-8 text-text-light">
                Produtos da igreja com catalogo simples, retirada local e
                pagamento inicial por Pix manual.
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

          <Link
            className="block overflow-hidden rounded-md border border-border bg-background shadow-sm"
            to={mainBanner.buttonLink}
          >
            <img
              alt={mainBanner.title}
              className="aspect-[4/3] h-full w-full object-cover"
              src={mainBanner.imageUrl}
            />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5">
          <h2 className="text-2xl font-black text-secondary">
            Categorias em destaque
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {demoCategories.map((category) => (
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

      <ProductSection title="Produtos em destaque" products={featuredProducts} />
      <ProductSection title="Produtos recentes" products={recentProducts} />

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
          <InfoBlock
            title="Conheca a loja"
            text="A DUNAMIS STORE centraliza produtos da igreja em uma experiencia simples para celular e desktop."
          />
          <InfoBlock
            title="Retirada"
            text="A retirada inicial e feita na igreja, conforme as instrucoes exibidas no pedido."
          />
          <InfoBlock
            title="Pagamento"
            text="O pagamento inicial usa Pix manual. O comprovante sera conferido por um administrador."
          />
        </div>
      </section>
    </>
  );
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
