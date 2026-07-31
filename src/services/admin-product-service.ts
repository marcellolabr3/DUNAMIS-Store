import type {
  AdminCategoryOption,
  AdminProduct,
  AdminProductInput
} from '../types/admin-product';

interface AdminProductsResponse {
  products: AdminProduct[];
  categories: AdminCategoryOption[];
}

export async function getAdminProducts(filters: {
  query?: string;
  categoryId?: string;
}): Promise<AdminProductsResponse> {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set('busca', filters.query);
  }

  if (filters.categoryId) {
    params.set('categoria', filters.categoryId);
  }

  const response = await fetch(`/api/admin/products?${params.toString()}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os produtos.');
  }

  return response.json() as Promise<AdminProductsResponse>;
}

export async function createAdminProduct(input: AdminProductInput) {
  return sendProduct('/api/admin/products', 'POST', input);
}

export async function updateAdminProduct(id: string, input: AdminProductInput) {
  return sendProduct(`/api/admin/products/${id}`, 'PUT', input);
}

export async function duplicateAdminProduct(id: string) {
  const response = await fetch(`/api/admin/products/${id}/duplicate`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel duplicar o produto.');
  }

  return (await response.json()) as { product: AdminProduct };
}

export async function setAdminProductActive(id: string, active: boolean) {
  const response = await fetch(`/api/admin/products/${id}/active`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ active })
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel alterar a publicacao do produto.');
  }

  return (await response.json()) as { product: AdminProduct };
}

export async function deleteAdminProduct(id: string) {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel excluir o produto.');
  }
}

export async function uploadAdminProductImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/admin/product-images', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Nao foi possivel enviar a imagem.'));
  }

  return (await response.json()) as {
    image: {
      url: string;
      fileName: string;
    };
  };
}

async function sendProduct(
  url: string,
  method: 'POST' | 'PUT',
  input: AdminProductInput
) {
  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Nao foi possivel salvar o produto.'));
  }

  return (await response.json()) as { product: AdminProduct };
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as {
      error?: string;
      details?: string;
    };

    return payload.details || payload.error || fallback;
  } catch {
    return fallback;
  }
}
