import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { categories as mockCategories } from "../data/menuData";

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockCategories;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, image_url, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.warn("[categoryService] Supabase error, falling back to mock data:", error?.message);
    return mockCategories;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
  }));
}
