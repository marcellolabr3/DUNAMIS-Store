import { adminBannerSchema } from '../functions/schemas/admin-banner-schema';
import { storeSettingsSchema } from '../functions/schemas/store-settings-schema';

describe('admin customization schemas', () => {
  it('validates editable banners', () => {
    const banner = adminBannerSchema.parse({
      title: 'Nova colecao',
      description: 'Produtos oficiais da igreja',
      imageUrl: '/assets/banner.svg',
      buttonLabel: 'Comprar',
      buttonLink: '/catalogo',
      active: true,
      displayOrder: 1
    });

    expect(banner.title).toBe('Nova colecao');
    expect(banner.active).toBe(true);
  });

  it('rejects invalid theme colors', () => {
    expect(() =>
      storeSettingsSchema.parse({
        storeName: 'DUNAMIS STORE',
        storeDescription: 'Loja da igreja',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: 'yellow',
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
        pickupInstructions: 'Retirada na igreja.',
        deliveryInstructions: 'Entrega configuravel.',
        minimumOrderValue: 0,
        storeActive: true
      })
    ).toThrow();
  });
});
