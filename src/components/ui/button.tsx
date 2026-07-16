import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-sky-600 hover:bg-sky-700 text-white shadow-sm",
  secondary: "border border-sky-600 bg-white text-sky-600 hover:bg-slate-50 shadow-sm",
  outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm",
  ghost: "text-slate-600 hover:bg-slate-100",
  destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "default" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        suppressHydrationWarning
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-none text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          size === "sm" && "h-9 px-3",
          size === "default" && "h-11 px-5",
          size === "lg" && "h-12 px-6 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
