import type { AdminSession } from '../types/admin-auth';

const sessionCookieName = 'dunamis_admin_session';
const sessionMaxAgeSeconds = 60 * 60 * 8;

export async function createSessionCookie(
  session: Omit<AdminSession, 'expiresAt'>,
  secret: string
) {
  const payload: AdminSession = {
    ...session,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload, secret);

  return `${sessionCookieName}=${encodedPayload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${sessionMaxAgeSeconds}`;
}

export function clearSessionCookie() {
  return `${sessionCookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function readSessionFromRequest(
  request: Request,
  secret: string
): Promise<AdminSession | undefined> {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`));

  if (!cookie) {
    return undefined;
  }

  const token = cookie.slice(sessionCookieName.length + 1);
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return undefined;
  }

  const expectedSignature = await sign(encodedPayload, secret);

  if (signature !== expectedSignature) {
    return undefined;
  }

  const session = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSession;

  if (session.expiresAt < Date.now()) {
    return undefined;
  }

  return session;
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  );

  return base64UrlEncode(arrayBufferToBinary(signature));
}

function base64UrlEncode(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');

  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
}

function arrayBufferToBinary(buffer: ArrayBuffer) {
  let binary = '';

  for (const byte of new Uint8Array(buffer)) {
    binary += String.fromCharCode(byte);
  }

  return binary;
}
