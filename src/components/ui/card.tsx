import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("rounded-none border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function CardHeader({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("border-b border-slate-200/80 px-6 py-5", className)}>{children}</div>;
}

export function CardContent({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function CardTitle({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <h2 className={cn("text-lg font-semibold tracking-tight text-slate-950", className)}>{children}</h2>;
}

export function CardDescription({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <p className={cn("mt-1 text-sm leading-6 text-slate-600", className)}>{children}</p>;
}
