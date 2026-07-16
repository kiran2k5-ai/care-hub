import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
