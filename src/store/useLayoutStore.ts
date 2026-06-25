import { create } from 'zustand';

export interface Fixture {
  fixtureId: string;
  label: string;
  fixtureType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shelves: { shelfId: string; shelfNumber: number; label: string | null }[];
  updatedAt: string;
}

export interface DraftFixture {
  tempId: string;
  label: string;
  fixtureType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shelves: { shelfNumber: number; label: string | null }[];
}

export type CanvasItem = Fixture | DraftFixture;

export function isSaved(item: CanvasItem): item is Fixture {
  return 'fixtureId' in item;
}

interface LayoutState {
  items: CanvasItem[];
  selectedId: string | null;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;

  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  loadFromServer: (fixtures: Fixture[]) => void;
  addDraft: (draft: DraftFixture) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateRotation: (id: string, rotation: number) => void;
  selectItem: (id: string | null) => void;
  deleteSelected: () => void;
  markClean: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  items: [],
  selectedId: null,
  isDirty: false,
  isLoading: false,
  error: null,

  setLoading: (v) => set({ isLoading: v }),
  setError: (msg) => set({ error: msg }),

  loadFromServer: (fixtures) =>
    set({ items: fixtures, isDirty: false, error: null }),

  addDraft: (draft) =>
    set((s) => ({ items: [...s.items, draft], isDirty: true, selectedId: draft.tempId })),

  updatePosition: (id, x, y) =>
    set((s) => ({
      items: s.items.map((item) => {
        const itemId = isSaved(item) ? item.fixtureId : item.tempId;
        return itemId === id ? { ...item, x, y } : item;
      }),
      isDirty: true,
    })),

  updateRotation: (id, rotation) =>
    set((s) => ({
      items: s.items.map((item) => {
        const itemId = isSaved(item) ? item.fixtureId : item.tempId;
        return itemId === id ? { ...item, rotation } : item;
      }),
      isDirty: true,
    })),

  selectItem: (id) => set({ selectedId: id }),

  deleteSelected: () =>
    set((s) => ({
      items: s.items.filter((item) => {
        const itemId = isSaved(item) ? item.fixtureId : item.tempId;
        return itemId !== s.selectedId;
      }),
      selectedId: null,
      isDirty: true,
    })),

  markClean: () => set({ isDirty: false }),
}));