import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { categories as mockCategories } from "../data/menuData";

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

/** Pick the image URL from whichever column the user's schema uses. */
function resolveImageUrl(row: Record<string, unknown>): string {
  // Try common variations in order
  const candidates = [
    "image_url",
    "image",
    "photo_url",
    "icon_url",
    "thumbnail_url",
    "img_url",
    "picture_url",
  ];
  for (const key of candidates) {
    if (typeof row[key] === "string" && row[key]) return row[key] as string;
  }
  return "";
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockCategories;
  }

  // Use select("*") so we don't hard-code column names that may differ in the
  // user's actual Supabase schema — then map flexibly below.
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error || !data || data.length === 0) {
    console.warn(
      "[categoryService] Supabase error or empty, falling back to mock data:",
      error?.message ?? "no rows returned"
    );
    return mockCategories;
  }

  // Log the first row so the user can see the actual column names
  console.log("[categoryService] First row from Supabase:", data[0]);

  const rows = data as Record<string, unknown>[];

  // Sort by sort_order if present
  rows.sort((a, b) => {
    const ao = typeof a["sort_order"] === "number" ? (a["sort_order"] as number) : 0;
    const bo = typeof b["sort_order"] === "number" ? (b["sort_order"] as number) : 0;
    return ao - bo;
  });

  return rows.map((row) => ({
    id: String(row["id"] ?? ""),
    name: String(row["name"] ?? ""),
    imageUrl: resolveImageUrl(row),
  }));
}
