import { ENV } from '../config/env';
import { ApiError } from './authService';
import type { Category, Product, Store, SessionInitResponse, ApiResponse, PaginatedResponse, ShoppingList, ShoppingListItem } from '../types';

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

// ── GET /api/stores/{storeId} ─────────────────
export async function getStore(
  storeId: string,
  sessionToken: string,
): Promise<Store> {
  const url = `${BASE_URL}/api/stores/${storeId}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  const data: ApiResponse<Store> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to load store (${response.status})`);
  }
  return data.response;
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

// ── GET /api/products?storeId=xxx&page=1&size=20 ─────
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

// ── GET /api/shopping-lists/{listId} ──────────
export async function getShoppingList(
  listId: string,
  sessionToken: string,
): Promise<ShoppingList> {
  const response = await fetch(`${BASE_URL}/api/shopping-lists/${listId}`, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  const data: ApiResponse<ShoppingList> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to load cart (${response.status})`);
  }
  return data.response;
}

// ── DELETE /api/shopping-lists/{listId} ────────
export async function deleteShoppingList(
  listId: string,
  sessionToken: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/shopping-lists/${listId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data?.message ?? `Failed to clear cart (${response.status})`);
  }
}

// ── GET /api/shopping-lists/active ────────────
export async function getActiveShoppingList(sessionToken: string): Promise<ShoppingList> {
  const response = await fetch(`${BASE_URL}/api/shopping-lists/active`, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  const data: ApiResponse<ShoppingList> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to load shopping list (${response.status})`);
  }
  return data.response;
}

// ── POST /api/shopping-lists/{listId}/items ───
export async function addShoppingListItem(
  listId: string,
  productId: string,
  sessionToken: string,
): Promise<ShoppingListItem> {
  const response = await fetch(`${BASE_URL}/api/shopping-lists/${listId}/items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ productId, quantity: 1 }),
  });
  const data: ApiResponse<ShoppingListItem> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to add item (${response.status})`);
  }
  return data.response;
}

// ── PATCH /api/shopping-lists/{listId}/items/{itemId} ──
export async function updateShoppingListItem(
  listId: string,
  itemId: string,
  quantity: number,
  sessionToken: string,
): Promise<ShoppingListItem> {
  const response = await fetch(`${BASE_URL}/api/shopping-lists/${listId}/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify({ quantity }),
  });
  const data: ApiResponse<ShoppingListItem> = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Failed to update item (${response.status})`);
  }
  return data.response;
}

// ── DELETE /api/shopping-lists/{listId}/items/{itemId} ──
export async function deleteShoppingListItem(
  listId: string,
  itemId: string,
  sessionToken: string,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/shopping-lists/${listId}/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'accept': '*/*',
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data?.message ?? `Failed to remove item (${response.status})`);
  }
}