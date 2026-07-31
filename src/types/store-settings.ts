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

export interface AdminBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  buttonLink: string;
  active: boolean;
  displayOrder: number;
}
