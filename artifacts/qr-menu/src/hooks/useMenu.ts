import { useState, useEffect, useCallback } from "react";
import { getCategories, type Category } from "../services/categoryService";
import { getMenuItems, type MenuItem } from "../services/menuService";

export type UseMenuState = {
  categories: Category[];
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useMenu(): UseMenuState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [cats, items] = await Promise.all([getCategories(), getMenuItems()]);

        if (!cancelled) {
          setCategories(cats);
          setMenuItems(items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while loading the menu."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  const refetch = useCallback(() => setFetchCount((n) => n + 1), []);

  return { categories, menuItems, loading, error, refetch };
}
