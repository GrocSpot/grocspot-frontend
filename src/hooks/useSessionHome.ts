import { useState, useEffect, useMemo } from 'react';
import { getCategories, getProducts } from '../services/sessionService';
import type { Category, Product } from '../types';

export interface CartItem {
  product: Product;
  qty: number;
}

export function useSessionHome(storeId: string, sessionToken: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  // ── Fetch categories once ─────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoadingCats(true);
    getCategories(storeId, sessionToken)
      .then((cats) => { if (!cancelled) setCategories(cats); })
      .catch((err) => { if (!cancelled) setError(err?.message ?? 'Failed to load categories.'); })
      .finally(() => { if (!cancelled) setIsLoadingCats(false); });
    return () => { cancelled = true; };
  }, [storeId, sessionToken]);

  // ── Fetch products when category changes ──
  useEffect(() => {
    let cancelled = false;
    setIsLoadingProducts(true);
    const categoryId = selectedCategoryId === 'all' ? undefined : selectedCategoryId;
    getProducts(storeId, sessionToken, categoryId)
      .then((prods) => { if (!cancelled) setProducts(prods); })
      .catch((err) => { if (!cancelled) setError(err?.message ?? 'Failed to load products.'); })
      .finally(() => { if (!cancelled) setIsLoadingProducts(false); });
    return () => { cancelled = true; };
  }, [storeId, sessionToken, selectedCategoryId]);

  // ── Cart helpers ──────────────────────────
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(product.productId);
      next.set(product.productId, {
        product,
        qty: existing ? existing.qty + 1 : 1,
      });
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(productId);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        next.delete(productId);
      } else {
        next.set(productId, { ...existing, qty: existing.qty - 1 });
      }
      return next;
    });
  };

  const cartCount = useMemo(() =>
    Array.from(cart.values()).reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const cartItems = useMemo(() => Array.from(cart.values()), [cart]);

  return {
    categories,
    products,
    isLoadingCats,
    isLoadingProducts,
    error,
    selectedCategoryId,
    setSelectedCategoryId,
    cart,
    cartCount,
    cartItems,
    addToCart,
    removeFromCart,
  };
}