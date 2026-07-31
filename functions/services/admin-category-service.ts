import {
  AdminCategoryRepository,
  type AdminCategoryRow
} from '../repositories/admin-category-repository';

export class AdminCategoryService {
  constructor(private readonly repository: AdminCategoryRepository) {}

  async list() {
    const categories = await this.repository.getCategories();

    return categories.results.map(mapCategory);
  }

  async setActive(id: string, active: boolean) {
    const category = await this.repository.setActive(id, active);

    return category ? mapCategory(category) : undefined;
  }
}

function mapCategory(row: AdminCategoryRow) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    active: row.active === 1,
    displayOrder: row.display_order
  };
}
