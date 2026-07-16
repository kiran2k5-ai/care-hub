import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseServiceRoleKey, hasSupabaseServiceRole } from "./config";

export function createSupabaseServiceRoleClient() {
  if (!hasSupabaseServiceRole() || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase service role key in environment.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}
