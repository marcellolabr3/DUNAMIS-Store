import { AdminReportRepository } from '../../../repositories/admin-report-repository';
import { AdminReportService } from '../../../services/admin-report-service';
import type { Env } from '../../../types/bindings';
import { requireAdmin } from '../../../utils/admin-request';
import { errorResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const csv = await new AdminReportService(
    new AdminReportRepository(context.env.DB)
  ).ordersCsv();

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="pedidos-dunamis-store.csv"',
      'x-content-type-options': 'nosniff'
    }
  });
}
