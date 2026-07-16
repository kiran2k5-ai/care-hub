"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export function RealtimeRefresh({ channel = "appointments" }: { channel?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !hasSupabaseEnv()) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const subscription = supabase
      .channel(channel)
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => {
        router.refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "medical_reports" }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, [channel, router]);

  return null;
}
