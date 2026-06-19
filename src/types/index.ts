// ─────────────────────────────────────────────
//  types/index.ts
//
//  Centralised TypeScript types for the app.
//  Add every screen name + its params here.
// ─────────────────────────────────────────────

// ── Navigation ────────────────────────────────

export type RootStackParamList = {
  SignUp: undefined;
  EmailSent: { email: string };
  Login: undefined;
  Home: undefined;
  QRScan: { token: string };
  SessionHome: { storeId: string; sessionId?: string; sessionToken: string };
  Search: { sessionToken: string; categories: Category[] };
};

export type StoreOpeningHours = Record<string, string>;

export interface Store {
  storeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  openingHours: StoreOpeningHours;
  createdAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchProduct {
  productId: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
}

export interface Product {
  productId: string;
  name: string;
  brand: string;
  barcode: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  storeId: string;
  metadata: {
    weightGrams?: number;
    isVegetarian?: boolean;
    [key: string]: unknown;
  };
}