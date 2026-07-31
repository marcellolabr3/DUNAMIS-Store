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

export interface StoreSettingsRow {
  store_name: string;
  store_description: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  pix_key: string;
  pix_receiver_name: string;
  pix_receiver_city: string;
  order_expiration_minutes: number;
  allow_pickup: number;
  allow_delivery: number;
  pickup_instructions: string;
  delivery_instructions: string;
  minimum_order_value: number;
  store_active: number;
  page_content: string;
}
