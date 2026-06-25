import { useEffect, useCallback } from 'react';
import { useLayoutStore } from '../store/useLayoutStore';
import { ENV } from '../config/env';

const BASE_URL = ENV.API_BASE_URL;

export function useLayout(storeId: string, accessToken: string) {
  const {
    items,
    isLoading,
    isDirty,
    error,
    setLoading,
    setError,
    loadFromServer,
    markClean,
  } = useLayoutStore();

  // Fetch layout on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/stores/${storeId}/layout`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`Failed to load layout: ${res.status}`);
        const data = await res.json();
        if (!cancelled) loadFromServer(data.fixtures ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load layout');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [storeId]);

  // Save full layout to backend
  const saveLayout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = items.map((item) => ({
        label: item.label,
        fixtureType: item.fixtureType,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        rotation: item.rotation,
        shelves: item.shelves.map((s) => ({
          shelfNumber: s.shelfNumber,
          label: s.label ?? null,
        })),
      }));

      const res = await fetch(`${BASE_URL}/api/stores/${storeId}/layout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ fixtures: payload }),
      });
      if (!res.ok) throw new Error(`Failed to save layout: ${res.status}`);
      const data = await res.json();
      loadFromServer(data.fixtures ?? []);
      markClean();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save layout');
    } finally {
      setLoading(false);
    }
  }, [storeId, accessToken, items]);

  return { items, isLoading, isDirty, error, saveLayout };
}