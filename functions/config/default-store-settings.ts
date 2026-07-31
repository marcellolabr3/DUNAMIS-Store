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
  pixKey: '',
  pixReceiverName: 'DUNAMIS STORE',
  pixReceiverCity: 'SAO PAULO',
  orderExpirationMinutes: 60,
  allowPickup: true,
  allowDelivery: false,
  pickupInstructions: 'Retirada na igreja conforme orientacoes do pedido.',
  deliveryInstructions: 'Entrega configuravel pelo painel administrativo.',
  minimumOrderValue: 0,
  storeActive: true
};
