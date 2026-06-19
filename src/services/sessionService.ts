import { ENV } from '../config/env';
import { ApiError } from './authService';
import type { Category, Product, SessionInitResponse, ApiResponse, PaginatedResponse } from '../types';

const BASE_URL = ENV.API_BASE_URL;

// ── GUEST ONLY ────────────────────────────────
export async function initGuestSession(
  qrToken: string,
): Promise<SessionInitResponse> {
  const response = await fetch(`${BASE_URL}/api/sessions/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qrToken,
      deviceInfo: navigator?.userAgent ?? 'unknown',
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Session init failed (${response.status})`);
  }
  return data as SessionInitResponse;
}

// ── GET /api/categories?storeId=xxx&page=1&size=20 ───
export async function getCategories(
  storeId: string,
  sessionToken: string,
): Promise<Category[]> {
  const url = `${BASE_URL}/api/categories?storeId=${storeId}&page=1&size=20`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  const data: ApiResponse<PaginatedResponse<Category>> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to load categories (${response.status})`);
  }
  return data.response.content;
}

// ── GET /api/products?storeId=xxx&page=1&size=10 ─────
export async function getProducts(
  storeId: string,
  sessionToken: string,
  categoryId?: string,
): Promise<Product[]> {
  const params = new URLSearchParams({
    storeId,
    page: '1',
    size: '20',
  });
  if (categoryId) params.append('categoryId', categoryId);

  const url = `${BASE_URL}/api/products?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  const data: ApiResponse<PaginatedResponse<Product>> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to load products (${response.status})`);
  }
  return data.response.content;
}