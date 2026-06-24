import { useState, useEffect, useMemo, useCallback } from 'react';
import { getStore, getCategories, getProducts, getActiveShoppingList, getShoppingList, deleteShoppingList, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem } from '../services/sessionService';
import type { Category, Product, Store } from '../types';

export interface CartItem {
  product: Product;
  qty: number;
  itemId: string | null;
}

export function useSessionHome(storeId: string, sessionToken: string, searchQuery = '') {
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [listId, setListId] = useState<string | null>(null);
  const [isRefreshingCart, setIsRefreshingCart] = useState(false);

  // ── Fetch active shopping list (get listId) ──
  useEffect(() => {
    let cancelled = false;
    getActiveShoppingList(sessionToken)
      .then((list) => { if (!cancelled) setListId(list.listId); })
      .catch(() => { /* non-fatal — add will be local-only if this fails */ });
    return () => { cancelled = true; };
  }, [sessionToken]);

  // ── Fetch store info once ─────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoadingStore(true);
    getStore(storeId, sessionToken)
      .then((s) => { if (!cancelled) setStore(s); })
      .catch(() => { /* non-fatal — fall back to generic label */ })
      .finally(() => { if (!cancelled) setIsLoadingStore(false); });
    return () => { cancelled = true; };
  }, [storeId, sessionToken]);

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

  // ── Fetch products when category or search query changes ──
  useEffect(() => {
    let cancelled = false;
    setIsLoadingProducts(true);
    setError(null);
    const categoryId = selectedCategoryId === 'all' ? undefined : selectedCategoryId;
    getProducts(storeId, sessionToken, categoryId, searchQuery || undefined)
      .then((prods) => { if (!cancelled) setProducts(prods); })
      .catch((err) => { if (!cancelled) setError(err?.message ?? 'Failed to load products.'); })
      .finally(() => { if (!cancelled) setIsLoadingProducts(false); });
    return () => { cancelled = true; };
  }, [storeId, sessionToken, selectedCategoryId, searchQuery]);

  // ── Cart helpers ──────────────────────────
  const addToCart = (product: Product) => {
    const snapshot = cart.get(product.productId) ?? null;

    // Optimistic update
    setCart((prev) => {
      const next = new Map(prev);
      const cur = next.get(product.productId);
      next.set(product.productId, {
        product,
        qty: cur ? cur.qty + 1 : 1,
        itemId: cur?.itemId ?? null,
      });
      return next;
    });

    if (!listId) return;

    if (!snapshot) {
      // New product → POST
      addShoppingListItem(listId, product.productId, sessionToken)
        .then((item) => {
          setCart((prev) => {
            const next = new Map(prev);
            const cur = next.get(product.productId);
            if (!cur) return prev;
            next.set(product.productId, { ...cur, itemId: item.itemId });
            return next;
          });
        })
        .catch(() => {
          setCart((prev) => {
            const next = new Map(prev);
            next.delete(product.productId);
            return next;
          });
        });
    } else if (snapshot.itemId) {
      // Already in cart → PATCH with incremented quantity
      const newQty = snapshot.qty + 1;
      updateShoppingListItem(listId, snapshot.itemId, newQty, sessionToken)
        .catch(() => {
          setCart((prev) => {
            const next = new Map(prev);
            const cur = next.get(product.productId);
            if (!cur) return prev;
            if (cur.qty <= 1) next.delete(product.productId);
            else next.set(product.productId, { ...cur, qty: cur.qty - 1 });
            return next;
          });
        });
    }
  };

  const removeFromCart = (productId: string) => {
    const snapshot = cart.get(productId);
    if (!snapshot) return;

    const newQty = snapshot.qty - 1;

    // Optimistic update
    setCart((prev) => {
      const next = new Map(prev);
      if (newQty <= 0) {
        next.delete(productId);
      } else {
        next.set(productId, { ...snapshot, qty: newQty });
      }
      return next;
    });

    if (!listId || !snapshot.itemId) return;

    const revert = () => {
      setCart((prev) => {
        const next = new Map(prev);
        next.set(productId, snapshot);
        return next;
      });
    };

    if (newQty <= 0) {
      // Last unit → DELETE
      deleteShoppingListItem(listId, snapshot.itemId, sessionToken).catch(revert);
    } else {
      // Still units remaining → PATCH with decremented quantity
      updateShoppingListItem(listId, snapshot.itemId, newQty, sessionToken).catch(revert);
    }
  };

  const refreshCart = useCallback(async () => {
    if (!listId) return;
    setIsRefreshingCart(true);
    try {
      const list = await getShoppingList(listId, sessionToken);
      setCart((prev) => {
        const next = new Map<string, CartItem>();
        for (const item of list.items) {
          const existing = prev.get(item.productId);
          if (existing) {
            next.set(item.productId, {
              ...existing,
              qty: item.quantity,
              itemId: item.itemId,
            });
          }
        }
        return next;
      });
    } catch {
      // non-fatal — keep local state
    } finally {
      setIsRefreshingCart(false);
    }
  }, [listId, sessionToken]);

  const clearCart = useCallback(async () => {
    if (!listId) return;
    const snapshot = new Map(cart);
    const oldListId = listId;
    setCart(new Map());
    setListId(null);
    try {
      await deleteShoppingList(oldListId, sessionToken);
      const newList = await getActiveShoppingList(sessionToken);
      setListId(newList.listId);
    } catch {
      setCart(snapshot);
      setListId(oldListId);
    }
  }, [listId, sessionToken, cart]);

  const cartCount = useMemo(() =>
    Array.from(cart.values()).reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const cartItems = useMemo(() => Array.from(cart.values()), [cart]);

  return {
    store,
    isLoadingStore,
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
    listId,
    addToCart,
    removeFromCart,
    refreshCart,
    clearCart,
    isRefreshingCart,
  };
}