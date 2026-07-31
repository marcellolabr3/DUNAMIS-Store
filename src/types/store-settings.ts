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
  pageContent: StorePageContent;
}

export interface StorePageContent {
  homeEyebrow: string;
  homeTitle: string;
  homeDescription: string;
  featuredTitle: string;
  categoriesTitle: string;
  infoTitle: string;
  infoText: string;
  pickupTitle: string;
  pickupText: string;
  paymentTitle: string;
  paymentText: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogDescription: string;
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
  layoutMode: 'split' | 'full';
  aspectRatio: '16/7' | '21/9' | '4/3' | '1/1';
  imageFit: 'cover' | 'contain';
  backgroundColor: string;
  textColor: string;
}
