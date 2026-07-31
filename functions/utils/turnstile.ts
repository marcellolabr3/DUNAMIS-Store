export async function verifyTurnstile(input: {
  token?: string;
  secret?: string;
  ipAddress?: string;
}) {
  if (!input.secret) {
    return;
  }

  if (!input.token) {
    throw new Error('Validacao Turnstile ausente.');
  }

  const formData = new FormData();
  formData.set('secret', input.secret);
  formData.set('response', input.token);

  if (input.ipAddress && input.ipAddress !== 'unknown') {
    formData.set('remoteip', input.ipAddress);
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formData
    }
  );
  const result = (await response.json()) as { success: boolean };

  if (!result.success) {
    throw new Error('Validacao Turnstile invalida.');
  }
}
