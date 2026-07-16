import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-[1.75rem] border border-transparent bg-slate-100 px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d7ecfb]",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
