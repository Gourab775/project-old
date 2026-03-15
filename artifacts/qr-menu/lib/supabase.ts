import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string;
          name: string;
          image_url: string;
          sort_order: number;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string;
          is_veg: boolean;
          is_available: boolean;
          category_id: string;
          image_url: string;
        };
      };
    };
  };
};
