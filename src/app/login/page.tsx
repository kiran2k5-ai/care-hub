import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { Briefcase, Star } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white font-sans flex overflow-hidden">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-20 xl:px-24 py-12 max-w-[540px] w-full mx-auto z-10 bg-white">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b335c] text-white shadow-md">
              <Briefcase className="h-5.5 w-5.5" />
            </div>
            <span className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight group-hover:opacity-90 transition-opacity">
              CareHub
            </span>
          </Link>

          {/* Intro Headers */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#0b335c] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm font-semibold text-slate-400">
              Sign in to manage your healthcare journey with confidence.
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer Navigation */}
          <div className="text-center text-sm font-semibold text-slate-400 pt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-[#008b7e] hover:text-[#005c53] hover:underline transition-colors">
              Join Now
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Decorative Clinic View */}
      <div className="hidden lg:block relative flex-1">
        {/* Background Image */}
        <Image
          src="/login_clinic_bg.png"
          alt="CareHub Clinic Lobby"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Overlay Card */}
        <div className="absolute bottom-20 left-16 max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-slate-150/40 shadow-2xl space-y-5">
          {/* Star Rating */}
          <div className="flex gap-1 text-[#14b8a6]">
            <Star className="h-4.5 w-4.5 fill-current" />
            <Star className="h-4.5 w-4.5 fill-current" />
            <Star className="h-4.5 w-4.5 fill-current" />
            <Star className="h-4.5 w-4.5 fill-current" />
            <Star className="h-4.5 w-4.5 fill-current" />
          </div>

          {/* Testimonial Quote */}
          <p className="font-semibold italic text-base text-[#0b335c] leading-relaxed">
            &ldquo;The level of personalized care and the efficiency of the CareHub system is unlike anything I've experienced in healthcare. Truly top-tier service.&rdquo;
          </p>

          {/* Testimonial User Details */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-100 bg-slate-50 shrink-0">
              <Image
                src="/sarah_henderson.png"
                alt="Dr. Sarah Henderson"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0b335c]">Dr. Sarah Henderson</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Premium Member since 2021</p>
            </div>
          </div>
        </div>

        {/* Image Footer Credits */}
        <div className="absolute bottom-6 left-16 right-16 flex justify-between text-[11px] font-bold text-slate-400">
          <span>&copy; {new Date().getFullYear()} CareHub Healthcare</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-200 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-200 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-200 transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
