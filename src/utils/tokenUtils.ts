// ─────────────────────────────────────────────
//  src/utils/tokenUtils.ts
// ─────────────────────────────────────────────

export interface QRTokenPayload {
  sub: string;    // storeId
  tid: string;    // tenantId
  type: 'qr';
  iat: number;
  exp: number;
}

export function decodeQRToken(token: string): QRTokenPayload | null {
  try {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + (4 - (base64.length % 4)) % 4,
      '='
    );
    return JSON.parse(atob(padded)) as QRTokenPayload;
  } catch {
    return null;
  }
}

export function isQRTokenExpired(token: string): boolean {
  const payload = decodeQRToken(token);
  if (!payload?.exp) return false;
  return Date.now() / 1000 > payload.exp;
}