import { ENV } from '../config/env';
import { ApiError } from './authService';

const BASE_URL = ENV.API_BASE_URL;

export interface Store {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  aisle?: string;
  emoji?: string;
}

export interface StoreProductsResponse {
  store: Store;
  products: Product[];
}

export interface SessionInitResponse {
  statusCode: number;
  message: string;
  response: {
    sessionId: string;
    sessionToken: string;
    storeId: string;
    expiresAt: string;
  };
}

// ── GUEST ONLY ────────────────────────────────
export async function initGuestSession(
  qrToken: string,
): Promise<SessionInitResponse> {
  const response = await fetch(`${BASE_URL}/api/session/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qrToken,
      deviceInfo: navigator?.userAgent ?? 'unknown',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? `Session init failed (${response.status})`
    );
  }

  return data as SessionInitResponse;
}

// ── BOTH FLOWS ────────────────────────────────
//  Shopper: bearerToken = their login accessToken
//  Guest:   bearerToken = sessionToken from initGuestSession
export async function getStoreProducts(
  bearerToken: string,
  storeId: string,
): Promise<StoreProductsResponse> {
  const response = await fetch(
    `${BASE_URL}/api/store/products?storeId=${storeId}`,
    {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? `Failed to load products (${response.status})`
    );
  }

  return data as StoreProductsResponse;
}