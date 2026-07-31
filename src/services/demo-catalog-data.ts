import type { Banner, Category, Product } from '../types/catalog';

export const demoCategories: Category[] = [
  {
    id: 'demo-cat-camisetas',
    name: 'Camisetas',
    slug: 'camisetas',
    description: 'Camisetas da DUNAMIS STORE para uso diario e eventos.',
    imageUrl: '/demo/categories/camisetas.svg',
    displayOrder: 1
  },
  {
    id: 'demo-cat-livros',
    name: 'Livros',
    slug: 'livros',
    description: 'Livros, devocionais e materiais de estudo.',
    imageUrl: '/demo/categories/livros.svg',
    displayOrder: 2
  },
  {
    id: 'demo-cat-acessorios',
    name: 'Acessorios',
    slug: 'acessorios',
    description: 'Canecas, pulseiras e itens de apoio.',
    imageUrl: '/demo/categories/acessorios.svg',
    displayOrder: 3
  },
  {
    id: 'demo-cat-eventos',
    name: 'Eventos',
    slug: 'eventos',
    description: 'Inscricoes e materiais para eventos da igreja.',
    imageUrl: '/demo/categories/eventos.svg',
    displayOrder: 4
  },
  {
    id: 'demo-cat-infantil',
    name: 'Infantil',
    slug: 'infantil',
    description: 'Produtos para criancas.',
    imageUrl: '/demo/categories/infantil.svg',
    displayOrder: 5
  }
];

export const demoBanners: Banner[] = [
  {
    id: 'demo-banner-principal',
    title: 'DUNAMIS STORE',
    description: 'Produtos da igreja com retirada local e Pix manual.',
    imageUrl: '/demo/banners/banner-principal.svg',
    buttonLabel: 'Ver catalogo',
    buttonLink: '/catalogo',
    displayOrder: 1
  },
  {
    id: 'demo-banner-livros',
    title: 'Livros e devocionais',
    description: 'Materiais para leitura e estudo.',
    imageUrl: '/demo/banners/banner-livros.svg',
    buttonLabel: 'Conhecer livros',
    buttonLink: '/catalogo?categoria=livros',
    displayOrder: 2
  }
];

const createdAt = [
  '2026-07-31T12:00:00.000Z',
  '2026-07-30T12:00:00.000Z',
  '2026-07-29T12:00:00.000Z',
  '2026-07-28T12:00:00.000Z',
  '2026-07-27T12:00:00.000Z',
  '2026-07-26T12:00:00.000Z',
  '2026-07-25T12:00:00.000Z',
  '2026-07-24T12:00:00.000Z'
];

export const demoProducts: Product[] = [
  makeProduct({
    id: 'demo-prod-camiseta-classica',
    categorySlug: 'camisetas',
    name: 'Camiseta Dunamis Classica',
    slug: 'camiseta-dunamis-classica',
    shortDescription: 'Camiseta classica com identidade Dunamis.',
    sku: 'DEMO-CAM-CLASSICA',
    price: 6990,
    featured: true,
    imageUrl: '/demo/products/camiseta-classica.svg',
    createdAt: createdAt[0],
    variants: [
      ['P / Preta', 'P', 'Preta', 20],
      ['M / Preta', 'M', 'Preta', 20],
      ['G / Preta', 'G', 'Preta', 20],
      ['GG / Preta', 'GG', 'Preta', 20],
      ['P / Amarela', 'P', 'Amarela', 20],
      ['M / Amarela', 'M', 'Amarela', 20],
      ['G / Amarela', 'G', 'Amarela', 20],
      ['GG / Amarela', 'GG', 'Amarela', 20]
    ]
  }),
  makeProduct({
    id: 'demo-prod-camiseta-fe',
    categorySlug: 'camisetas',
    name: 'Camiseta Fe em Movimento',
    slug: 'camiseta-fe-em-movimento',
    shortDescription: 'Camiseta preta com mensagem de fe.',
    sku: 'DEMO-CAM-FE',
    price: 7490,
    featured: false,
    imageUrl: '/demo/products/camiseta-fe.svg',
    createdAt: createdAt[1],
    variants: [
      ['P / Preta', 'P', 'Preta', 15],
      ['M / Preta', 'M', 'Preta', 15],
      ['G / Preta', 'G', 'Preta', 15],
      ['GG / Preta', 'GG', 'Preta', 15]
    ]
  }),
  makeProduct({
    id: 'demo-prod-devocional-30-dias',
    categorySlug: 'livros',
    name: 'Devocional 30 Dias',
    slug: 'devocional-30-dias',
    shortDescription: 'Devocional para leitura diaria.',
    sku: 'DEMO-LIV-DEV30',
    price: 3990,
    featured: true,
    imageUrl: '/demo/products/devocional-30-dias.svg',
    createdAt: createdAt[2],
    variants: [['Unico', undefined, undefined, 40]]
  }),
  makeProduct({
    id: 'demo-prod-biblia-estudo',
    categorySlug: 'livros',
    name: 'Biblia de Estudo',
    slug: 'biblia-de-estudo',
    shortDescription: 'Biblia de estudo para aprofundamento.',
    sku: 'DEMO-LIV-BIBLIA',
    price: 12990,
    featured: false,
    imageUrl: '/demo/products/biblia-estudo.svg',
    createdAt: createdAt[3],
    variants: [['Unico', undefined, undefined, 12]]
  }),
  makeProduct({
    id: 'demo-prod-caneca-dunamis',
    categorySlug: 'acessorios',
    name: 'Caneca Dunamis',
    slug: 'caneca-dunamis',
    shortDescription: 'Caneca personalizada Dunamis.',
    sku: 'DEMO-ACE-CANECA',
    price: 3490,
    featured: false,
    imageUrl: '/demo/products/caneca-dunamis.svg',
    createdAt: createdAt[4],
    variants: [['Unico', undefined, undefined, 30]]
  }),
  makeProduct({
    id: 'demo-prod-pulseira-dunamis',
    categorySlug: 'acessorios',
    name: 'Pulseira Dunamis',
    slug: 'pulseira-dunamis',
    shortDescription: 'Pulseira simples com identidade Dunamis.',
    sku: 'DEMO-ACE-PULSEIRA',
    price: 1490,
    featured: false,
    imageUrl: '/demo/products/pulseira-dunamis.svg',
    createdAt: createdAt[5],
    variants: [['Unico', undefined, undefined, 50]]
  }),
  makeProduct({
    id: 'demo-prod-conferencia-dunamis',
    categorySlug: 'eventos',
    name: 'Conferencia Dunamis',
    slug: 'conferencia-dunamis',
    shortDescription: 'Inscricao ficticia para conferencia.',
    sku: 'DEMO-EVE-CONF',
    price: 4990,
    featured: false,
    imageUrl: '/demo/products/conferencia-dunamis.svg',
    createdAt: createdAt[6],
    variants: [['Unico', undefined, undefined, 100]]
  }),
  makeProduct({
    id: 'demo-prod-camiseta-kids',
    categorySlug: 'infantil',
    name: 'Camiseta Dunamis Kids',
    slug: 'camiseta-dunamis-kids',
    shortDescription: 'Camiseta infantil Dunamis.',
    sku: 'DEMO-INF-CAMKIDS',
    price: 5490,
    featured: false,
    imageUrl: '/demo/products/camiseta-kids.svg',
    createdAt: createdAt[7],
    variants: [
      ['Tamanho 4', '4', undefined, 10],
      ['Tamanho 6', '6', undefined, 10],
      ['Tamanho 8', '8', undefined, 10],
      ['Tamanho 10', '10', undefined, 10],
      ['Tamanho 12', '12', undefined, 10]
    ]
  })
];

interface ProductInput {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  sku: string;
  price: number;
  featured: boolean;
  imageUrl: string;
  createdAt: string;
  variants: Array<[string, string | undefined, string | undefined, number]>;
}

function makeProduct(input: ProductInput): Product {
  const category = demoCategories.find((item) => item.slug === input.categorySlug);

  if (!category) {
    throw new Error(`Missing demo category: ${input.categorySlug}`);
  }

  return {
    id: input.id,
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    description: `${input.shortDescription} Produto ficticio para demonstracao do catalogo.`,
    sku: input.sku,
    price: input.price,
    active: true,
    featured: input.featured,
    trackStock: true,
    createdAt: input.createdAt,
    images: [
      {
        id: `${input.id}-img-main`,
        productId: input.id,
        url: input.imageUrl,
        altText: `Imagem demonstrativa de ${input.name}`,
        displayOrder: 1,
        isMain: true
      }
    ],
    variants: input.variants.map(([name, size, color, stockQuantity], index) => ({
      id: getDemoVariantId(input.id, name, index),
      productId: input.id,
      name,
      sku: `${input.sku}-${index + 1}`,
      size,
      color,
      priceAdjustment: 0,
      stockQuantity
    }))
  };
}

function getDemoVariantId(productId: string, name: string, index: number) {
  const ids: Record<string, string> = {
    'demo-prod-camiseta-classica:P / Preta': 'demo-var-classica-p-preta',
    'demo-prod-camiseta-classica:M / Preta': 'demo-var-classica-m-preta',
    'demo-prod-camiseta-classica:G / Preta': 'demo-var-classica-g-preta',
    'demo-prod-camiseta-classica:GG / Preta': 'demo-var-classica-gg-preta',
    'demo-prod-camiseta-classica:P / Amarela': 'demo-var-classica-p-amarela',
    'demo-prod-camiseta-classica:M / Amarela': 'demo-var-classica-m-amarela',
    'demo-prod-camiseta-classica:G / Amarela': 'demo-var-classica-g-amarela',
    'demo-prod-camiseta-classica:GG / Amarela': 'demo-var-classica-gg-amarela',
    'demo-prod-camiseta-fe:P / Preta': 'demo-var-fe-p-preta',
    'demo-prod-camiseta-fe:M / Preta': 'demo-var-fe-m-preta',
    'demo-prod-camiseta-fe:G / Preta': 'demo-var-fe-g-preta',
    'demo-prod-camiseta-fe:GG / Preta': 'demo-var-fe-gg-preta',
    'demo-prod-devocional-30-dias:Unico': 'demo-var-devocional-unico',
    'demo-prod-biblia-estudo:Unico': 'demo-var-biblia-unico',
    'demo-prod-caneca-dunamis:Unico': 'demo-var-caneca-unico',
    'demo-prod-pulseira-dunamis:Unico': 'demo-var-pulseira-unico',
    'demo-prod-conferencia-dunamis:Unico': 'demo-var-conferencia-unico',
    'demo-prod-camiseta-kids:Tamanho 4': 'demo-var-kids-4',
    'demo-prod-camiseta-kids:Tamanho 6': 'demo-var-kids-6',
    'demo-prod-camiseta-kids:Tamanho 8': 'demo-var-kids-8',
    'demo-prod-camiseta-kids:Tamanho 10': 'demo-var-kids-10',
    'demo-prod-camiseta-kids:Tamanho 12': 'demo-var-kids-12'
  };

  return ids[`${productId}:${name}`] ?? `${productId}-var-${index + 1}`;
}
