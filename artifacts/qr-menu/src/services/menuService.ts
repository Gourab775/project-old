import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { menuItems as mockMenuItems } from "../data/menuData";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
  imageUrl: string;
};

function mapRow(row: Record<string, unknown>): MenuItem {
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

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockMenuItems;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*");

  if (error || !data) {
    console.warn("[menuService] Supabase error, falling back to mock data:", error?.message);
    return mockMenuItems;
  }

  console.log(`[menuService] Fetched ${data.length} items from Supabase`);
  return (data as Record<string, unknown>[]).map(mapRow);
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockMenuItems.filter((item) => item.categoryId === categoryId);
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category_id", categoryId);

  if (error || !data) {
    console.warn("[menuService] Supabase category filter error, falling back:", error?.message);
    return mockMenuItems.filter((item) => item.categoryId === categoryId);
  }

  return (data as Record<string, unknown>[]).map(mapRow);
}
