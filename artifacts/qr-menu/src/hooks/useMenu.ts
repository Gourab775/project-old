import { useState, useEffect, useCallback, useRef } from "react";
import {
  getMenu,
  getCachedMenu,
  clearMenuCache,
} from "../services/menuCacheService";
import type { Category } from "../services/categoryService";
import type { MenuItem } from "../services/menuService";

export type UseMenuState = {
  categories: Category[];
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  /** Clears the cache and fetches fresh data with a loading indicator. */
  refetch: () => void;
  /** ISO string of when the data was last fetched from the server, or null. */
  lastFetchedAt: string | null;
};

export function useMenu(): UseMenuState {
  // Initialise state from cache synchronously so the first render is instant.
  const [categories, setCategories] = useState<Category[]>(
    () => getCachedMenu()?.categories ?? []
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    () => getCachedMenu()?.menuItems ?? []
  );
  // If we already have cached data, skip the loading spinner entirely.
  const [loading, setLoading] = useState(() => getCachedMenu() === null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);

  // fetchKey: bump to trigger the effect; forceRefresh tracks whether to bypass cache.
  const [fetchKey, setFetchKey] = useState(0);
  const forceRefreshRef = useRef(false);

  // Whether the current run is the very first mount
  const isMountRef = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const isFirstMount = isMountRef.current;
    const force = forceRefreshRef.current;
    isMountRef.current = false;
    forceRefreshRef.current = false;

    // On first mount with cached data → silent background refresh only.
    // On forced refresh or no cache → show loading spinner.
    const hasCacheHit = isFirstMount && categories.length > 0;

    if (!hasCacheHit) {
      setLoading(true);
      setError(null);
    }

    getMenu(force)
      .then((data) => {
        if (cancelled) return;
        setCategories(data.categories);
        setMenuItems(data.menuItems);
        setLastFetchedAt(new Date().toISOString());
        // Always clear loading (covers both the spinner case and silent refresh)
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        // getMenu() should never throw (it falls back to stale/mock), but guard anyway.
        setError(
          err instanceof Error ? err.message : "Failed to load menu."
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // fetchKey is the only intentional trigger; other state values are output.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey]);

  const refetch = useCallback(() => {
    clearMenuCache();
    forceRefreshRef.current = true;
    setFetchKey((n) => n + 1);
  }, []);

  return { categories, menuItems, loading, error, refetch, lastFetchedAt };
}
