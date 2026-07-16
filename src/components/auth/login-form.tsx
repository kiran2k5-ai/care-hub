"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { signInAction } from "@/app/actions";
import { Eye, EyeOff, AtSign } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await signInAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Signed in");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3.5 pr-10 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            {...form.register("email")}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <AtSign className="h-4 w-4" />
          </div>
        </div>
        {form.formState.errors.email && (
          <p className="text-xs font-semibold text-rose-600 mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Password
          </label>
          <Link href="#" className="text-xs font-bold text-[#008b7e] hover:text-[#005c53] transition-colors">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3.5 pr-10 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs font-semibold text-rose-600 mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          className="h-4.5 w-4.5 rounded border-slate-200 text-teal-600 focus:ring-teal-500 cursor-pointer"
        />
        <label htmlFor="remember-me" className="ml-2 text-sm font-semibold text-slate-400 cursor-pointer select-none">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-white py-4 font-bold text-sm shadow-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-50 cursor-pointer text-center"
      >
        {isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
