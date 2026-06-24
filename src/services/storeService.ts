import { apiFetch, bearerHeaders } from './apiClient';
import { API_URLS } from './apiUrls';

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

export async function getStoreProducts(
  bearerToken: string,
  storeId: string,
): Promise<StoreProductsResponse> {
  return apiFetch<StoreProductsResponse>(API_URLS.storeBrowse.products(storeId), {
    headers: { ...bearerHeaders(bearerToken), 'Content-Type': 'application/json' },
  });
}
