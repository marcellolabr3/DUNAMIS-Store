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

  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/i.test(fileName)) {
    return errorResponse('Imagem invalida.', 400);
  }

  const object = await context.env.RECEIPTS_BUCKET.get(
    `banner-images/${fileName}`
  );

  if (!object) {
    return errorResponse('Imagem nao encontrada.', 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
}
