import { apiFetch, bearerHeaders } from './apiClient';
import { API_URLS } from './apiUrls';
import type { Category, Product, Store, SessionInitResponse, ApiResponse, PaginatedResponse, ShoppingList, ShoppingListItem } from '../types';

export async function initGuestSession(qrToken: string): Promise<SessionInitResponse> {
  return apiFetch<SessionInitResponse>(API_URLS.sessions.init, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qrToken,
      deviceInfo: navigator?.userAgent ?? 'unknown',
    }),
  });
}

export async function getStore(storeId: string, sessionToken: string): Promise<Store> {
  const data = await apiFetch<ApiResponse<Store>>(API_URLS.stores.byId(storeId), {
    headers: bearerHeaders(sessionToken),
  });
  return data.response;
}

export async function getCategories(storeId: string, sessionToken: string): Promise<Category[]> {
  const url = `${API_URLS.categories}?storeId=${storeId}&page=1&size=20`;
  const data = await apiFetch<ApiResponse<PaginatedResponse<Category>>>(url, {
    headers: bearerHeaders(sessionToken),
  });
  return data.response.content;
}

export async function getProducts(
  storeId: string,
  sessionToken: string,
  categoryId?: string,
  query?: string,
): Promise<Product[]> {
  const params = new URLSearchParams({ storeId, page: '1', size: '20' });
  if (categoryId) params.append('categoryId', categoryId);
  if (query) params.append('query', query);
  const data = await apiFetch<ApiResponse<PaginatedResponse<Product>>>(`${API_URLS.products}?${params.toString()}`, {
    headers: bearerHeaders(sessionToken),
  });
  return data.response.content;
}

export async function getShoppingList(listId: string, sessionToken: string): Promise<ShoppingList> {
  const data = await apiFetch<ApiResponse<ShoppingList>>(API_URLS.shoppingLists.byId(listId), {
    headers: bearerHeaders(sessionToken),
  });
  return data.response;
}

export async function deleteShoppingList(listId: string, sessionToken: string): Promise<void> {
  await apiFetch<unknown>(API_URLS.shoppingLists.byId(listId), {
    method: 'DELETE',
    headers: bearerHeaders(sessionToken),
  });
}

export async function getActiveShoppingList(sessionToken: string): Promise<ShoppingList> {
  const data = await apiFetch<ApiResponse<ShoppingList>>(API_URLS.shoppingLists.active, {
    headers: bearerHeaders(sessionToken),
  });
  return data.response;
}

export async function addShoppingListItem(
  listId: string,
  productId: string,
  sessionToken: string,
): Promise<ShoppingListItem> {
  const data = await apiFetch<ApiResponse<ShoppingListItem>>(API_URLS.shoppingLists.items(listId), {
    method: 'POST',
    headers: { ...bearerHeaders(sessionToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity: 1 }),
  });
  return data.response;
}

export async function updateShoppingListItem(
  listId: string,
  itemId: string,
  quantity: number,
  sessionToken: string,
): Promise<ShoppingListItem> {
  const data = await apiFetch<ApiResponse<ShoppingListItem>>(API_URLS.shoppingLists.item(listId, itemId), {
    method: 'PATCH',
    headers: { ...bearerHeaders(sessionToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return data.response;
}

export async function deleteShoppingListItem(
  listId: string,
  itemId: string,
  sessionToken: string,
): Promise<void> {
  await apiFetch<unknown>(API_URLS.shoppingLists.item(listId, itemId), {
    method: 'DELETE',
    headers: bearerHeaders(sessionToken),
  });
}
