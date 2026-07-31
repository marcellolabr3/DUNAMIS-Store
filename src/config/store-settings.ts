export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  pixKey: string;
  pixReceiverName: string;
  pixReceiverCity: string;
  orderExpirationMinutes: number;
  allowPickup: boolean;
  allowDelivery: boolean;
  pickupInstructions: string;
  deliveryInstructions: string;
  minimumOrderValue: number;
  storeActive: boolean;
}

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
  pickupInstructions: 'Retirada na igreja conforme orientações do pedido.',
  deliveryInstructions: 'Entrega configurável pelo painel administrativo.',
  minimumOrderValue: 0,
  storeActive: true
};
