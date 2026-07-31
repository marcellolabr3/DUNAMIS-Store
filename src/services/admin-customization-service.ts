import type { AdminBanner, StoreSettings } from '../types/store-settings';

export async function getAdminSettings() {
  const response = await fetch('/api/admin/settings', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as configuracoes.');
  }

  return response.json() as Promise<{ settings: StoreSettings }>;
}

export async function updateAdminSettings(settings: StoreSettings) {
  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(settings)
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel salvar as configuracoes.');
  }

  return response.json() as Promise<{ settings: StoreSettings }>;
}

export async function getAdminBanners() {
  const response = await fetch('/api/admin/banners', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os banners.');
  }

  return response.json() as Promise<{ banners: AdminBanner[] }>;
}

export async function createAdminBanner(input: Omit<AdminBanner, 'id'>) {
  const response = await fetch('/api/admin/banners', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel criar o banner.');
  }

  return response.json() as Promise<{ banner: AdminBanner }>;
}

export async function updateAdminBanner(
  id: string,
  input: Omit<AdminBanner, 'id'>
) {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel salvar o banner.');
  }

  return response.json() as Promise<{ banner: AdminBanner }>;
}

export async function deleteAdminBanner(id: string) {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel excluir o banner.');
  }
}

export async function uploadAdminBannerImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/admin/banner-images', {
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
