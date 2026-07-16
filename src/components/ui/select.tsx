import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-[1.75rem] border border-transparent bg-slate-100 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d7ecfb]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";
