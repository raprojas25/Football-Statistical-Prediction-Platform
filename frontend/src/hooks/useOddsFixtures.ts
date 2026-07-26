import { useEffect } from 'react';
import { useOddsStore } from '@/stores/odds.store';
import type { OddsFixture } from '@/types';

export function useOddsFixtures(path: string) {
  const data = useOddsStore((s) => s.data[path]);
  const isLoading = useOddsStore((s) => s.loading[path] ?? false);
  const error = useOddsStore((s) => s.errors[path] ?? null);
  const loadFixtures = useOddsStore((s) => s.loadFixtures);

  useEffect(() => {
    loadFixtures(path);
  }, [path, loadFixtures]);

  const fixtures: OddsFixture[] = data?.fixtures ?? [];

  return { data, fixtures, isLoading, error };
}
