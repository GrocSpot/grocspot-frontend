// ─────────────────────────────────────────────
//  src/utils/tokenUtils.ts
// ─────────────────────────────────────────────

// ── Existing QR token helpers (unchanged) ─────

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

// ── NEW: Access token helpers ──────────────────

export interface AccessTokenPayload {
  sub: string;
  role: string;        
  storeId?: string;    
  exp: number;
  iat: number;
}

/**
 * Decodes the JWT access token saved after login.
 * Does NOT verify the signature — that's the backend's job.
 * Used only to read claims like userRole for client-side routing.
 */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + (4 - (base64.length % 4)) % 4,
      '='
    );
    return JSON.parse(atob(padded)) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function getUserRole(token: string): 'manager' | 'shopper' | null {
  const payload = decodeAccessToken(token);
  if (!payload?.role) return null;
  return payload.role as 'manager' | 'shopper';
}