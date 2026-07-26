import { create } from 'zustand';
import type { OddsData } from '@/types';

interface OddsStore {
  data: Record<string, OddsData | undefined>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  loadFixtures: (path: string) => Promise<void>;
}

export const useOddsStore = create<OddsStore>()((set, get) => ({
  data: {},
  loading: {},
  errors: {},
  loadFixtures: async (path: string) => {
    const state = get();
    if (state.data[path] || state.loading[path]) return;

    set((s) => ({
      loading: { ...s.loading, [path]: true },
      errors: { ...s.errors, [path]: null },
    }));

    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Error (${res.status})`);
      const json: OddsData = await res.json();
      set((s) => ({
        data: { ...s.data, [path]: json },
        loading: { ...s.loading, [path]: false },
      }));
    } catch (err) {
      set((s) => ({
        loading: { ...s.loading, [path]: false },
        errors: {
          ...s.errors,
          [path]: err instanceof Error ? err.message : 'Unknown error',
        },
      }));
    }
  },
}));
