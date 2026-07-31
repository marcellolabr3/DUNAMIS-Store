import type { UploadedReceipt } from '../types/checkout';

export async function uploadPaymentReceipt(input: {
  publicToken: string;
  file: File;
}): Promise<UploadedReceipt> {
  const formData = new FormData();
  formData.append('receipt', input.file);

  const response = await fetch(`/api/orders/${input.publicToken}/receipt`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel enviar o comprovante.');
  }

  const payload = (await response.json()) as { receipt: UploadedReceipt };

  return payload.receipt;
}
