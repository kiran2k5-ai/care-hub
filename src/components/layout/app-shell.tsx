"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarDays, 
  FileText, 
  Home, 
  LayoutGrid, 
  LogOut, 
  ShieldCheck, 
  Stethoscope, 
  UserRound, 
  Users, 
  Clock, 
  Settings,
  Bell,
  MessageSquare,
  HelpCircle,
  Plus
} from "lucide-react";
import type { Role } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/app/actions";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleLinks: Record<Role, NavItem[]> = {
  patient: [
    { label: "Overview", href: "/patient/dashboard", icon: Home },
    { label: "Book Appointment", href: "/patient/doctors", icon: Stethoscope },
    { label: "Appointments", href: "/patient/appointments", icon: CalendarDays },
    { label: "Medical Records", href: "/patient/records", icon: FileText },
    { label: "Prescriptions", href: "/patient/prescriptions", icon: FileText },
    { label: "Settings", href: "/patient/profile", icon: Settings },
  ],
  doctor: [
    { label: "Overview", href: "/doctor/dashboard", icon: LayoutGrid },
    { label: "Schedule", href: "/doctor/appointments", icon: CalendarDays },
    { label: "Patients", href: "/doctor/patients", icon: Users },
    { label: "Settings", href: "/doctor/profile", icon: Settings },
  ],
  admin: [{ label: "Dashboard", href: "/admin/dashboard", icon: ShieldCheck }],
};

interface AppShellProps {
  role: Role;
  title: string;
  subtitle: string;
  profile?: {
    fullName: string;
    specialty: string;
    avatarUrl?: string;
  };
}

export function AppShell({ 
  role, 
  title, 
  subtitle, 
  profile: initialProfile,
  children 
}: React.PropsWithChildren<AppShellProps>) {
  const pathname = usePathname();
  const brandName = "CareHub";

  // Client-side profile state to ensure correct dynamic doctor/patient name load on all sub-pages
  const [profile, setProfile] = useState<{ fullName: string; specialty: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user basic profile info
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (!prof) return;

        let spec = "Member";
        if (prof.role === "doctor") {
          const { data: docProf } = await supabase
            .from("doctor_profiles")
            .select("specialty")
            .eq("id", user.id)
            .maybeSingle();
          if (docProf) {
            spec = docProf.specialty;
          } else {
            spec = "Cardiologist";
          }
        } else if (prof.role === "patient") {
          spec = "Patient";
        }

        setProfile({
          fullName: prof.full_name,
          specialty: spec,
          avatarUrl: prof.avatar_url || undefined,
        });
      } catch (err) {
        console.error("Error loading user profile client side:", err);
      }
    }

    if (initialProfile) {
      setProfile(initialProfile);
    } else {
      fetchProfile();
    }
  }, [initialProfile]);

  const userFullName = profile?.fullName || (role === "doctor" ? "Dr. Smith, MD" : "User Account");
  const userSpecialty = profile?.specialty || (role === "doctor" ? "Cardiologist" : role === "patient" ? "Patient" : "Member");

  if (role === "patient" || role === "doctor") {
    const firstName = profile?.fullName?.split(" ")[0] || (role === "doctor" ? "Doctor" : "Sarah");
    const sidebarItems = role === "patient" ? [
      { label: "Dashboard", href: "/patient/dashboard", icon: LayoutGrid },
      { label: "Appointments", href: "/patient/appointments", icon: CalendarDays },
      { label: "Medical Records", href: "/patient/records", icon: FileText },
      { label: "Messages", href: "/patient/messages", icon: MessageSquare },
      { label: "Settings", href: "/patient/profile", icon: Settings },
    ] : [
      { label: "Dashboard", href: "/doctor/dashboard", icon: LayoutGrid },
      { label: "Appointments", href: "/doctor/appointments", icon: CalendarDays },
      { label: "Medical Records", href: "/doctor/patients", icon: FileText },
      { label: "Messages", href: "/doctor/messages", icon: MessageSquare },
      { label: "Settings", href: "/doctor/profile", icon: Settings },
    ];

    const dashboardPath = role === "patient" ? "/patient/dashboard" : "/doctor/dashboard";
    const headerTitle = role === "patient" ? `Good morning, ${firstName}` : "Doctor Workspace";

    return (
      <div className="min-h-screen bg-[#f4f7fa] flex font-sans">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col justify-between shrink-0 sticky top-0 h-screen">
          <div className="p-6 space-y-8 flex-1">
            {/* Logo */}
            <Link href={dashboardPath} className="block">
              <span className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">CareHub</span>
            </Link>

            {/* Menu */}
            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.label === "Dashboard" && pathname === dashboardPath);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-xl ${
                      active
                        ? "bg-[#3bf0df] text-[#0b335c] shadow-[0_4px_12px_rgba(59,240,223,0.15)]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-[#0b335c]" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom links and stand-alone turquoise Book Appointment button */}
          <div className="p-6 border-t border-slate-100 space-y-4">
            {role === "patient" && (
              <Link 
                href="/patient/doctors"
                className="bg-[#3bf0df] hover:bg-[#2ed2c2] text-[#0b335c] font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors w-full"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span>Book Appointment</span>
              </Link>
            )}

            <Link href="#" className="flex items-center gap-3.5 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <HelpCircle className="h-5 w-5 text-slate-400" />
              <span>Help Center</span>
            </Link>
            
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3.5 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-5 w-5 text-slate-400" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-transparent px-8 pt-8 pb-4 flex items-center justify-between">
            <h1 className="font-serif font-bold text-2xl text-[#0b335c]">
              {headerTitle}
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Notification icon */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/50 transition-all cursor-pointer">
                <Bell className="h-5.5 w-5.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#3bf0df] ring-2 ring-white" />
              </button>
              
              {/* Profile Avatar */}
              <Link href={role === "patient" ? "/patient/profile" : "/doctor/profile"} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm hover:opacity-90 transition-opacity">
                {profile?.avatarUrl ? (
                  <Image 
                    src={profile.avatarUrl} 
                    alt={userFullName} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#3bf0df]/20 text-[#0b335c] font-bold text-sm">
                    {userFullName.charAt(0) || "S"}
                  </div>
                )}
              </Link>
            </div>
          </header>

          {/* Children and Footer */}
          <main className="flex-1 px-8 pb-8 flex flex-col justify-between gap-8">
            <div className="flex-1 space-y-8">
              {children}
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200/60 pt-8 pb-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
                <p className="leading-relaxed">
                  Providing high-standard medical care through precision, reliability, and human empathy.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Accessibility</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">Compliance</h4>
                <p className="leading-relaxed mb-4">HIPAA Compliant</p>
                <p>&copy; {new Date().getFullYear()} CareHub. All rights reserved.</p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50/50 px-3 py-3 sm:px-6 lg:px-8 lg:py-6 font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[55%] rounded-full bg-sky-50/50 blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[40%] h-[50%] rounded-full bg-sky-50/40 blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[260px_1fr] lg:gap-6">
        {/* Sidebar in Box Format */}
        <aside className="border border-slate-200 bg-white rounded-none p-4 sm:p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-sky-600 text-white shadow-md">
                <Clock className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="font-extrabold text-lg tracking-tight text-slate-900">{brandName}</p>
                {role === "admin" && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">{role} workspace</p>
                )}
              </div>
            </Link>

            <nav className="hidden space-y-1 lg:block">
              {roleLinks[role].map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-none px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      active 
                        ? "bg-sky-50 text-sky-600 border-l-2 border-sky-600" 
                        : "text-slate-400 hover:bg-sky-50/40 hover:text-sky-600"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* User Profile Info in Box Format */}
            <div className="flex items-center gap-3 p-1">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-none border border-sky-100 bg-sky-50">
                {profile?.avatarUrl ? (
                  <Image 
                    src={profile.avatarUrl} 
                    alt={userFullName} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sky-100 text-sky-600 font-bold text-sm rounded-none">
                    {userFullName.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800 leading-tight">{userFullName}</p>
                <p className="truncate text-xs font-semibold text-slate-400 leading-normal">{userSpecialty}</p>
              </div>
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-none border border-sky-100 bg-white px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-sky-50/60 hover:text-sky-600 hover:border-sky-200"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex flex-col justify-between min-h-[calc(100vh-3rem)] space-y-6">
          <div className="space-y-6">
            {children}
          </div>

          {/* Admin Portal Footer */}
          {role === "admin" && (
            <footer className="border-t border-slate-200/60 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-none bg-sky-100 text-sky-600">
                  <Clock className="h-3 w-3" />
                </div>
                <span className="font-bold text-slate-500">{brandName}</span>
              </div>
              <p>&copy; {new Date().getFullYear()} {brandName} Clinical Systems. Admin Portal. HIPAA Compliant.</p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-sky-600 transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-sky-600 transition-colors">Staff Policies</Link>
                <Link href="#" className="hover:text-sky-600 transition-colors">Security</Link>
              </div>
            </footer>
          )}
        </main>
      </div>

      {/* Mobile navigation in Box Format */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-sky-100 bg-white/95 px-2 py-2 backdrop-blur-lg lg:hidden shadow-[0_-8px_30px_rgba(14,165,233,0.05)]">
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
          {roleLinks[role].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex flex-1 flex-col items-center justify-center py-2 text-[10px] font-bold transition-all rounded-none ${
                  active 
                    ? "bg-sky-600 text-white shadow-sm" 
                    : "text-slate-500 hover:text-sky-600"
                }`}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
