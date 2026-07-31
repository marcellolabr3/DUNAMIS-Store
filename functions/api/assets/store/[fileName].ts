import type { Env } from '../../../types/bindings';
import { errorResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  params: {
    fileName: string;
  };
}

export async function onRequestGet(context: PagesFunctionContext) {
  const fileName = context.params.fileName;

  if (!/^(logo|favicon)-[a-f0-9-]+\.(jpg|png|webp|ico)$/i.test(fileName)) {
    return errorResponse('Arquivo invalido.', 400);
  }

  const object = await context.env.RECEIPTS_BUCKET.get(`store-assets/${fileName}`);

  if (!object) {
    return errorResponse('Arquivo nao encontrado.', 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
}
