import type { StoreSettings } from '../types/store-settings';

export const defaultStoreSettings: StoreSettings = {
  storeName: 'DUNAMIS STORE',
  storeDescription: 'Loja virtual de produtos da igreja.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#F5C400',
  secondaryColor: '#111111',
  contactEmail: 'contato@dunamisstore.local',
  contactPhone: '',
  whatsappNumber: '',
  pixKey: 'pix-demo@dunamisstore.local',
  pixReceiverName: 'DUNAMIS STORE',
  pixReceiverCity: 'SAO PAULO',
  orderExpirationMinutes: 60,
  allowPickup: true,
  allowDelivery: false,
  pickupInstructions: 'Retirada na igreja conforme orientacoes do pedido.',
  deliveryInstructions: 'Entrega configuravel pelo painel administrativo.',
  minimumOrderValue: 0,
  storeActive: true,
  pageContent: {
    homeEyebrow: 'Loja virtual da igreja',
    homeTitle: 'DUNAMIS STORE',
    homeDescription:
      'Produtos da igreja com catalogo simples, retirada local e pagamento inicial por Pix manual.',
    featuredTitle: 'Produtos em destaque',
    categoriesTitle: 'Categorias em destaque',
    infoTitle: 'Conheca a loja',
    infoText:
      'A DUNAMIS STORE centraliza produtos da igreja em uma experiencia simples para celular e desktop.',
    pickupTitle: 'Retirada',
    pickupText:
      'A retirada inicial e feita na igreja, conforme as instrucoes exibidas no pedido.',
    paymentTitle: 'Pagamento',
    paymentText:
      'O pagamento inicial usa Pix manual. O comprovante sera conferido por um administrador.',
    catalogEyebrow: 'Catalogo',
    catalogTitle: 'Produtos DUNAMIS STORE',
    catalogDescription:
      'Produtos da igreja com catalogo simples e retirada local.'
  }
};
