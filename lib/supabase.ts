import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log(
      "[Supabase] Initializing client, URL:",
      url ? url.substring(0, 30) + "..." : "MISSING",
      "Key:",
      key ? "set" : "MISSING",
    );
    if (!url || !key) {
      throw new Error("Supabase environment variables are not set.");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}
