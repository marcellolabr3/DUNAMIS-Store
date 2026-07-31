import {
  type AdminBannerInput,
  adminBannerSchema
} from '../schemas/admin-banner-schema';
import {
  type AdminBannerRow,
  AdminBannerRepository
} from '../repositories/admin-banner-repository';

export class AdminBannerService {
  constructor(private readonly repository: AdminBannerRepository) {}

  async list() {
    const banners = await this.repository.getBanners();

    return banners.results.map(mapBanner);
  }

  async create(input: unknown) {
    const parsed = adminBannerSchema.parse(input);
    const id = crypto.randomUUID();

    await this.repository.createBanner(id, parsed);

    const banner = await this.repository.getBanner(id);

    return banner ? mapBanner(banner) : undefined;
  }

  async update(id: string, input: unknown) {
    const parsed = adminBannerSchema.parse(input);
    const existing = await this.repository.getBanner(id);

    if (!existing) {
      return undefined;
    }

    await this.repository.updateBanner(id, parsed);

    const banner = await this.repository.getBanner(id);

    return banner ? mapBanner(banner) : undefined;
  }

  async remove(id: string) {
    const existing = await this.repository.getBanner(id);

    if (!existing) {
      return false;
    }

    await this.repository.softDeleteBanner(id);

    return true;
  }
}

function mapBanner(row: AdminBannerRow): AdminBannerInput & { id: string } {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    buttonLabel: row.button_label,
    buttonLink: row.button_link,
    active: row.active === 1,
    displayOrder: row.display_order,
    layoutMode: row.layout_mode as 'split' | 'full',
    aspectRatio: row.aspect_ratio as '16/7' | '21/9' | '4/3' | '1/1',
    imageFit: row.image_fit as 'cover' | 'contain',
    backgroundColor: row.background_color,
    textColor: row.text_color
  };
}
