import { AdminOrderRepository } from '../../../../../repositories/admin-order-repository';
import { AdminOrderService } from '../../../../../services/admin-order-service';
import type { Env } from '../../../../../types/bindings';
import { requireAdmin } from '../../../../../utils/admin-request';
import { errorResponse } from '../../../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
  params: {
    id: string;
    receiptId: string;
  };
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const service = new AdminOrderService(
    new AdminOrderRepository(context.env.DB)
  );
  const receipt = await service.getReceiptForDownload(
    context.params.id,
    context.params.receiptId
  );

  if (!receipt) {
    return errorResponse('Comprovante nao encontrado.', 404);
  }

  const object = await context.env.RECEIPTS_BUCKET.get(receipt.r2_key);

  if (!object) {
    return errorResponse('Arquivo nao encontrado.', 404);
  }

  return new Response(object.body, {
    headers: {
      'content-type': receipt.mime_type,
      'content-disposition': `attachment; filename="${receipt.file_name}"`,
      'x-content-type-options': 'nosniff'
    }
  });
}
