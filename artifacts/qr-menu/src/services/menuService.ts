import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import {
  categories as mockCategories,
  menuItems as mockMenuItems,
  type Category,
  type MenuItem,
} from "../data/menuData";

export type { Category, MenuItem };

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockCategories;
  }

  const { data, error } = await supabase
    .from("menu_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.warn("Supabase error fetching categories, using mock data:", error?.message);
    return mockCategories;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
  }));
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockMenuItems;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*");

  if (error || !data) {
    console.warn("Supabase error fetching menu items, using mock data:", error?.message);
    return mockMenuItems;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    isVeg: row.is_veg,
    isAvailable: row.is_available,
    categoryId: row.category_id,
    imageUrl: row.image_url,
  }));
}
