import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Can be ignored if called from a Server Component.
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch (error) {
          // Can be ignored if called from a Server Component.
        }
      },
    },
  });
}
