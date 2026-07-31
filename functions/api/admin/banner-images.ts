import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

const maxBannerImageSize = 6 * 1024 * 1024;
const allowedImageMimeTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const admin = await requireAdmin(context.request, context.env);

    if (!admin) {
      return errorResponse('Nao autenticado.', 401);
    }

    const formData = await context.request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return errorResponse('Imagem obrigatoria.', 400);
    }

    const extension = validateBannerImage(file);
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const r2Key = `banner-images/${fileName}`;

    await context.env.RECEIPTS_BUCKET.put(r2Key, file.stream(), {
      httpMetadata: {
        contentType: file.type
      },
      customMetadata: {
        uploadedBy: admin.id,
        purpose: 'banner-image'
      }
    });

    return jsonResponse(
      {
        image: {
          url: `/api/assets/banner-images/${fileName}`,
          fileName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      'Nao foi possivel enviar a imagem.',
      422,
      error instanceof Error ? error.message : undefined
    );
  }
}

function validateBannerImage(file: File) {
  const extension = allowedImageMimeTypes.get(file.type);

  if (!extension) {
    throw new Error('Envie JPG, PNG ou WebP.');
  }

  if (file.size <= 0 || file.size > maxBannerImageSize) {
    throw new Error('Imagem excede o tamanho permitido.');
  }

  return extension;
}
