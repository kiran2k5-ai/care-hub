import { AppShell } from "@/components/layout/app-shell";
import { getPatientProfile, getReports, getAppointments, getDoctors } from "@/lib/queries";
import { RealtimeRefresh } from "@/components/live/realtime-refresh";
import { getCurrentUserId } from "@/lib/current-user";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { 
  Search, 
  MapPin, 
  Shield, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  UploadCloud, 
  HelpCircle, 
  CalendarCheck, 
  Stethoscope,
  UserRound
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function PatientDashboardPage() {
  const patientId = await getCurrentUserId();
  
  // Fetch patient profile
  const patientProfile = patientId ? await getPatientProfile(patientId) : null;
  
  // Fetch patient's reports
  const reports = patientId ? await getReports(patientId) : [];

  // Fetch patient's appointments
  const appointments = patientId ? await getAppointments("patient", patientId) : [];

  // Fetch doctors list for inline search
  const doctors = await getDoctors();

  // Find the recently visited doctor
  const today = new Date();
  const pastAppointments = appointments.filter(
    (app) => new Date(app.scheduledAt) < today || app.status === "completed"
  );
  const sortedPast = [...pastAppointments].sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );
  const recentDoctor = sortedPast[0] || null;

  return (
    <AppShell
      role="patient"
      title="Patient dashboard"
      subtitle="Track upcoming visits, review clinical files, and access coordinated medical care."
      profile={patientProfile ? { fullName: patientProfile.fullName, specialty: "Patient" } : undefined}
    >
      <RealtimeRefresh />

      {/* Onboarding section card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2.5 max-w-xl">
            <span className="inline-block bg-[#3bf0df] text-[#0b335c] text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase">
              Onboarding
            </span>
            <h2 className="font-serif font-bold text-3xl text-[#0b335c] tracking-tight">Let's complete your profile</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Complete these few steps to unlock full access to booking, digital prescriptions, and premium health tracking.
            </p>
          </div>

          {/* Progress shield and status */}
          <div className="relative flex items-center justify-end w-full lg:w-64 h-20 shrink-0">
            {/* Shield Watermark Icon */}
            <Shield className="absolute right-0 top-1/2 -translate-y-1/2 h-24 w-24 text-slate-150 stroke-1 opacity-20 pointer-events-none" />
            
            {/* Progress bar and text */}
            <div className="flex items-center gap-3.5 z-10 w-full justify-end">
              <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0b7a75] h-full rounded-full" style={{ width: "70%" }} />
              </div>
              <span className="text-xs font-bold text-[#0b335c] whitespace-nowrap">70% Complete</span>
            </div>
          </div>
        </div>

        {/* Steps sub-grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {/* Step 1: Account Created */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm flex-1">
            <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Account Created</h4>
              <p className="text-xs text-slate-400 font-medium">Email verified</p>
            </div>
          </div>

          {/* Step 2: Insurance Info */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm flex-1">
            <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5.5 w-5.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Insurance Info</h4>
              <p className="text-xs text-slate-400 font-medium">Completed</p>
            </div>
          </div>

          {/* Step 3: Medical History (Locked) */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 opacity-60 select-none flex-1">
            <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-400">Medical History</h4>
              <p className="text-xs text-slate-400 font-medium">Locked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Find Your First Doctor search */}
      <DashboardSearch doctors={doctors} />

      {/* Bottom Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Services Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/70 rounded-3xl overflow-hidden flex flex-col md:flex-row justify-between shadow-sm min-h-[380px] relative">
          {/* Card Content (on left) and image (on right) */}
          <div className="p-8 space-y-6 flex-1 flex flex-col justify-between md:max-w-[55%] z-10">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#0b335c] leading-tight">
                Explore Our Full Range of Healthcare Services
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                From preventive care to specialized surgeries, find exactly what you need.
              </p>
            </div>
            
            <Link 
              href="/patient/services" 
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors group cursor-pointer"
            >
              <span>View available services</span>
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Side Background Image */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[42%] h-full hidden md:block">
            <Image
              src="/explore_services.png"
              alt="Healthcare services"
              fill
              className="object-cover object-center"
              sizes="(max-w-768px) 100vw, 30vw"
            />
            {/* Soft gradient overlay to blend into white */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
          </div>
        </div>

        {/* Right Side: 3 Shortcut Cards Stack */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {/* Card A: Recently Visited Doctor */}
            {recentDoctor ? (
              <Link 
                href="/patient/doctors" 
                className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#0b335c]">Recently Visited</h4>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{recentDoctor.doctorName}</p>
                    <p className="text-slate-400 text-xs font-medium">{recentDoctor.specialty}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link 
                href="/patient/doctors" 
                className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#0b335c]">Recent Doctor</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    No recent doctor visits. Book your first consultation.
                  </p>
                </div>
              </Link>
            )}

            {/* Card B: View Records */}
            <Link 
              href="/patient/records" 
              className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-base text-[#0b335c]">View Records</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Review your clinical scans, reports, and lab results.
                </p>
              </div>
            </Link>
          </div>

          {/* Card C: How it works horizontal banner */}
          <Link 
            href="#" 
            className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-3xl p-5 flex items-center justify-between shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-slate-100 text-[#0b335c] flex items-center justify-center shrink-0">
                <HelpCircle className="h-5.5 w-5.5 text-slate-500" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#0b335c]">How it works?</h4>
                <p className="text-slate-500 text-xs font-medium">Check out our guide for new members.</p>
              </div>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors shrink-0">
              <ArrowRight className="h-5 w-5 text-[#0b335c] transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Floating CTA / FAB button: Book a Walk */}
      <Link 
        href="/patient/doctors" 
        className="fixed bottom-6 right-6 bg-[#00695c] hover:bg-[#004d40] text-white flex items-center gap-2.5 px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 z-50 text-sm font-bold cursor-pointer"
      >
        <CalendarCheck className="h-5 w-5" />
        <span>Book a Walk</span>
      </Link>
    </AppShell>
  );
}
