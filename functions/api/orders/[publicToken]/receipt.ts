import { ReceiptRepository } from '../../../repositories/receipt-repository';
import { ReceiptService } from '../../../services/receipt-service';
import type { Env } from '../../../types/bindings';
import { errorResponse, jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
  params: {
    publicToken: string;
  };
}

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const formData = await context.request.formData();
    const file = formData.get('receipt');

    if (!(file instanceof File)) {
      return errorResponse('Comprovante obrigatorio.', 400);
    }

    const service = new ReceiptService(
      new ReceiptRepository(context.env.DB),
      context.env.RECEIPTS_BUCKET
    );
    const receipt = await service.uploadReceipt({
      publicToken: context.params.publicToken,
      file,
      ipAddress: context.request.headers.get('cf-connecting-ip') ?? undefined
    });

    return jsonResponse({ receipt }, { status: 201 });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel enviar o comprovante.',
      422,
      error instanceof Error ? error.message : undefined
    );
  }
}
