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

function mapRow(row: {
  id: string;
  name: string;
  price: number;
  description: string;
  is_veg: boolean;
  is_available: boolean;
  category_id: string;
  image_url: string;
}): MenuItem {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    isVeg: row.is_veg,
    isAvailable: row.is_available,
    categoryId: row.category_id,
    imageUrl: row.image_url,
  };
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockMenuItems;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, price, description, is_veg, is_available, category_id, image_url");

  if (error || !data) {
    console.warn("[menuService] Supabase error, falling back to mock data:", error?.message);
    return mockMenuItems;
  }

  return data.map(mapRow);
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockMenuItems.filter((item) => item.categoryId === categoryId);
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, price, description, is_veg, is_available, category_id, image_url")
    .eq("category_id", categoryId);

  if (error || !data) {
    console.warn("[menuService] Supabase error for category filter, falling back:", error?.message);
    return mockMenuItems.filter((item) => item.categoryId === categoryId);
  }

  return data.map(mapRow);
}
