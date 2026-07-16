import { hasSupabaseEnv } from "./supabase/config";
import { createSupabaseServerClient } from "./supabase/server";

export async function getCurrentUserId() {
  if (!hasSupabaseEnv()) {
    return undefined;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}
