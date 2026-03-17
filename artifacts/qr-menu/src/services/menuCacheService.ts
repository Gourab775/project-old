/**
 * menuCacheService.ts
 *
 * Single-fetch, localStorage-cached menu data layer.
 * • getCachedMenu()    – read fresh cache (null if missing/expired)
 * • getStaleCache()    – read cache ignoring expiry (used as fallback)
 * • setCachedMenu()    – persist with timestamp
 * • clearMenuCache()   – bust the cache
 * • getMenu()          – cache-first → Supabase → stale fallback → mock
 */

import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import {
  categories as mockCategories,
  menuItems as mockMenuItems,
} from "../data/menuData";
import type { Category } from "./categoryService";
import type { MenuItem } from "./menuService";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
};

type CacheEntry = {
  data: MenuData;
  timestamp: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CACHE_KEY = "qr-menu-data-v1";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Cache helpers ────────────────────────────────────────────────────────────

/** Returns cached MenuData if it exists and is within the TTL, else null. */
export function getCachedMenu(): MenuData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) return null; // expired

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Returns cached MenuData regardless of TTL (stale-while-revalidate fallback).
 * Used when the network fetch fails but there is any prior data.
 */
export function getStaleCache(): MenuData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}

/** Persist MenuData with the current timestamp. */
export function setCachedMenu(data: MenuData): void {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

/** Remove the cached entry (forces a fresh fetch next time). */
export function clearMenuCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

// ─── DB mapping ───────────────────────────────────────────────────────────────

function resolveImageUrl(row: Record<string, unknown>): string {
  for (const key of [
    "image_url",
    "image",
    "photo_url",
    "icon_url",
    "thumbnail_url",
  ]) {
    if (typeof row[key] === "string" && row[key]) return row[key] as string;
  }
  return "";
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    imageUrl: resolveImageUrl(row),
  };
}

function mapMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    price: Number(row["price"] ?? 0),
    description: String(row["description"] ?? ""),
    isVeg: Boolean(row["is_veg"] ?? false),
    isAvailable: Boolean(row["is_available"] ?? true),
    categoryId: String(row["category_id"] ?? ""),
    imageUrl: String(row["image_url"] ?? row["image"] ?? ""),
  };
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Execute a single parallel fetch of categories + menu_items from Supabase.
 * Throws if both requests fail so the caller can fall back to stale cache.
 */
export async function fetchMenuFromSupabase(): Promise<MenuData> {
  if (!isSupabaseConfigured || !supabase) {
    return { categories: mockCategories, menuItems: mockMenuItems };
  }

  const [catResult, itemResult] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("menu_items").select("*"),
  ]);

  // Hard-fail only when both calls error
  if (catResult.error && itemResult.error) {
    throw new Error(
      `Supabase fetch failed: ${catResult.error.message}`
    );
  }

  // Categories
  let categories: Category[];
  if (catResult.error || !catResult.data?.length) {
    console.warn("[menuCache] Categories fetch failed, using mock data");
    categories = mockCategories;
  } else {
    const rows = catResult.data as Record<string, unknown>[];
    rows.sort((a, b) => {
      const ao =
        typeof a["sort_order"] === "number" ? (a["sort_order"] as number) : 0;
      const bo =
        typeof b["sort_order"] === "number" ? (b["sort_order"] as number) : 0;
      return ao - bo;
    });
    categories = rows.map(mapCategory);
    console.log(`[menuCache] Fetched ${categories.length} categories`);
  }

  // Menu items
  let menuItems: MenuItem[];
  if (itemResult.error || !itemResult.data) {
    console.warn("[menuCache] Menu items fetch failed, using mock data");
    menuItems = mockMenuItems;
  } else {
    menuItems = (itemResult.data as Record<string, unknown>[]).map(mapMenuItem);
    console.log(`[menuCache] Fetched ${menuItems.length} items`);
  }

  return { categories, menuItems };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main entry point.
 *
 * Strategy (cache-first, stale-while-revalidate):
 * 1. If forceRefresh=false and fresh cache exists → return cache immediately.
 * 2. Otherwise → fetch from Supabase, store in cache, return.
 * 3. If fetch fails → serve stale cache if available.
 * 4. If nothing at all → return mock data (never throws).
 */
export async function getMenu(forceRefresh = false): Promise<MenuData> {
  if (!forceRefresh) {
    const cached = getCachedMenu();
    if (cached) {
      console.log("[menuCache] Serving from cache (fresh)");
      return cached;
    }
  }

  try {
    const data = await fetchMenuFromSupabase();
    setCachedMenu(data);
    return data;
  } catch (err) {
    const stale = getStaleCache();
    if (stale) {
      console.warn(
        "[menuCache] Fetch failed — serving stale cache:",
        err instanceof Error ? err.message : err
      );
      return stale;
    }

    console.warn(
      "[menuCache] Fetch failed and no cache — using mock data:",
      err instanceof Error ? err.message : err
    );
    return { categories: mockCategories, menuItems: mockMenuItems };
  }
}
