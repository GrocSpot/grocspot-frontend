export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  last: boolean;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}

export type RootStackParamList = {
  SignUp: undefined;
  EmailSent: { email: string };
  Login: undefined;
  Home: undefined;
  QRScan: { token: string };
  SessionHome: { storeId: string; sessionId?: string; sessionToken: string };
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
  mrp?: number;
  sellingPrice?: number;
  metadata: {
    weightGrams?: number;
    isVegetarian?: boolean;
    [key: string]: unknown;
  };
}

// ── Shopping list ─────────────────────────────

export interface ShoppingListItem {
  itemId: string;
  listId: string;
  productId: string;
  quantity: number;
  isCollected: boolean;
  collectedAt: string | null;
}

export interface ShoppingList {
  listId: string;
  userId: string;
  sessionId: string | null;
  status: string;
  createdAt: string;
  completedAt: string | null;
  items: ShoppingListItem[];
}

// ── Session init response ─────────────────────

export interface SessionInitResponse {
  statusCode: number;
  message: string;
  response: {
    expiresAt: string;
    sessionId: string;
    sessionToken: string;
    storeId: string;
  };
}