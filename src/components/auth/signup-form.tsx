"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signupSchema, type SignupInput } from "@/lib/validators";
import { signUpAction } from "@/app/actions";
import { Eye, EyeOff, AtSign, User } from "lucide-react";

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", role: "patient" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await signUpAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.needsConfirmation) {
        toast.success(result.message ?? "Check your email to confirm your account.");
        router.push("/login?confirmation=sent");
        return;
      }

      toast.success("Account created");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Full Name
        </label>
        <div className="relative">
          <input
            id="fullName"
            placeholder="John Doe"
            className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3.5 pr-10 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            {...form.register("fullName")}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <User className="h-4 w-4" />
          </div>
        </div>
        {form.formState.errors.fullName && (
          <p className="text-xs font-semibold text-rose-600 mt-1">{form.formState.errors.fullName.message}</p>
        )}
      </div>

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
        <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Password
        </label>
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

      {/* Role Selector */}
      <div className="space-y-2">
        <label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          I am registering as a
        </label>
        <select
          id="role"
          className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all cursor-pointer appearance-none"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
          {...form.register("role")}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Healthcare Provider</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-white py-4 font-bold text-sm shadow-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-50 cursor-pointer text-center mt-2"
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
