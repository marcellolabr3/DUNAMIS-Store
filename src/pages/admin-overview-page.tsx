import { useEffect, useState } from 'react';

import { ReportsContent } from './admin-reports-page';
import { getAdminReports } from '../services/admin-report-service';
import type { AdminReportData } from '../types/admin-report';

export function AdminOverviewPage() {
  const [data, setData] = useState<AdminReportData>();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const reports = await getAdminReports();

        if (active) {
          setData(reports);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar o painel.'
          );
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className="text-sm font-semibold text-danger">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-text-light">Carregando painel...</p>;
  }

  return <ReportsContent data={data} />;
}
