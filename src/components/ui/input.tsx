import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "flex h-12 w-full rounded-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-200",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
