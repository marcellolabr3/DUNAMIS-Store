import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

const maxAssetSize = 2 * 1024 * 1024;
const allowedLogoMimeTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);
const allowedFaviconMimeTypes = new Map([
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/x-icon', 'ico'],
  ['image/vnd.microsoft.icon', 'ico']
]);

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const admin = await requireAdmin(context.request, context.env);

    if (!admin) {
      return errorResponse('Nao autenticado.', 401);
    }

    const formData = await context.request.formData();
    const kind = formData.get('kind');
    const file = formData.get('image');

    if (kind !== 'logo' && kind !== 'favicon') {
      return errorResponse('Tipo de arquivo invalido.', 400);
    }

    if (!(file instanceof File)) {
      return errorResponse('Imagem obrigatoria.', 400);
    }

    const extension = validateStoreAsset(file, kind);
    const fileName = `${kind}-${crypto.randomUUID()}.${extension}`;
    const r2Key = `store-assets/${fileName}`;

    await context.env.RECEIPTS_BUCKET.put(r2Key, file.stream(), {
      httpMetadata: {
        contentType: file.type
      },
      customMetadata: {
        uploadedBy: admin.id,
        purpose: kind
      }
    });

    return jsonResponse(
      {
        asset: {
          url: `/api/assets/store/${fileName}`,
          fileName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      'Nao foi possivel enviar o arquivo.',
      422,
      error instanceof Error ? error.message : undefined
    );
  }
}

function validateStoreAsset(file: File, kind: 'logo' | 'favicon') {
  const allowedMimeTypes =
    kind === 'logo' ? allowedLogoMimeTypes : allowedFaviconMimeTypes;
  const extension = allowedMimeTypes.get(file.type);

  if (!extension) {
    throw new Error(
      kind === 'logo'
        ? 'Envie logo em JPG, PNG ou WebP.'
        : 'Envie favicon em PNG, WebP ou ICO.'
    );
  }

  if (file.size <= 0 || file.size > maxAssetSize) {
    throw new Error('Arquivo excede o tamanho permitido.');
  }

  return extension;
}
