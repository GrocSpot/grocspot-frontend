import { ENV } from '../config/env';

const BASE_URL = ENV.API_BASE_URL;

export const API_URLS = {
  auth: {
    signUp: `${BASE_URL}/api/auth/signup`,
    login: `${BASE_URL}/api/auth/login`,
    google: `${BASE_URL}/api/auth/google`,
    resendVerification: `${BASE_URL}/api/auth/resend-verification`,
  },
  sessions: {
    init: `${BASE_URL}/api/sessions/init`,
  },
  stores: {
    byId: (storeId: string) => `${BASE_URL}/api/stores/${storeId}`,
  },
  categories: `${BASE_URL}/api/categories`,
  products: `${BASE_URL}/api/products`,
  shoppingLists: {
    active: `${BASE_URL}/api/shopping-lists/active`,
    byId: (listId: string) => `${BASE_URL}/api/shopping-lists/${listId}`,
    items: (listId: string) => `${BASE_URL}/api/shopping-lists/${listId}/items`,
    item: (listId: string, itemId: string) => `${BASE_URL}/api/shopping-lists/${listId}/items/${itemId}`,
  },
  // Flow 3 — authenticated user browsing nearby stores and products in-app
  storeBrowse: {
    products: (storeId: string) => `${BASE_URL}/api/store/products?storeId=${storeId}`,
  },
};

export function assetUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : ENV.FRONTEND_BASE_URL;
  return `${base}${path}`;
}
