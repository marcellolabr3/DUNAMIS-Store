import type { AdminReportData } from '../types/admin-report';

export async function getAdminReports() {
  const response = await fetch('/api/admin/reports', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os relatorios.');
  }

  return response.json() as Promise<AdminReportData>;
}
