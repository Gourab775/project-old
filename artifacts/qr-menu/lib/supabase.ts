import { createClient } from "@supabase/supabase-js";

// Flexible row types — use Record so we can handle any column naming variation
// from the user's Supabase schema without hard-coding column names that may differ.
export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: Record<string, unknown>;
      };
      categories: {
        Row: Record<string, unknown>;
      };
      menu_items: {
        Row: Record<string, unknown>;
      };
    };
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
