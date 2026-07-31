export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  active: boolean;
  displayOrder: number;
}

export async function getAdminCategories() {
  const response = await fetch('/api/admin/categories', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as categorias.');
  }

  return response.json() as Promise<{ categories: AdminCategory[] }>;
}

export async function setAdminCategoryActive(id: string, active: boolean) {
  const response = await fetch(`/api/admin/categories/${id}/active`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ active })
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel alterar a categoria.');
  }

  return response.json() as Promise<{ category: AdminCategory }>;
}
