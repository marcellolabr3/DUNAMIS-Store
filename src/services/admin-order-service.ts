import type {
  AdminOrderDetails,
  AdminOrderSummary
} from '../types/admin-order';

export async function getAdminOrders(filters: {
  query?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const params = new URLSearchParams();

  if (filters.query) params.set('busca', filters.query);
  if (filters.status) params.set('status', filters.status);
  if (filters.dateFrom) params.set('de', filters.dateFrom);
  if (filters.dateTo) params.set('ate', filters.dateTo);

  const response = await fetch(`/api/admin/orders?${params.toString()}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os pedidos.');
  }

  return response.json() as Promise<{ orders: AdminOrderSummary[] }>;
}

export async function getAdminOrder(id: string) {
  const response = await fetch(`/api/admin/orders/${id}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar o pedido.');
  }

  return response.json() as Promise<{ order: AdminOrderDetails }>;
}

export async function updateAdminOrderStatus(
  id: string,
  status: string,
  note: string
) {
  return patchOrder(`/api/admin/orders/${id}/status`, { status, note });
}

export async function updateAdminOrderPayment(
  id: string,
  action: 'review' | 'confirm' | 'reject',
  note: string
) {
  return patchOrder(`/api/admin/orders/${id}/payment`, { action, note });
}

async function patchOrder(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel atualizar o pedido.');
  }

  return response.json() as Promise<{ order: AdminOrderDetails }>;
}
