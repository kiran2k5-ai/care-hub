import { AppShell } from "@/components/layout/app-shell";
import { getDoctorProfile, getAppointments } from "@/lib/queries";
import { getCurrentUserId } from "@/lib/current-user";
import { 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Lightbulb, 
  PhoneCall, 
  Video, 
  FileText,
  Clock,
  Sparkles,
  Users,
  Compass
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PatientProjectionsChart } from "@/components/dashboard/patient-projections-chart";

export default async function DoctorDashboardPage() {
  const doctorId = await getCurrentUserId();
  const doctorProfile = doctorId ? await getDoctorProfile(doctorId) : null;
  const appointments = doctorId ? await getAppointments("doctor", doctorId) : [];

  const upcomingPatients = appointments.filter(app => 
    ["pending", "accepted", "waiting"].includes(app.status) && 
    new Date(app.scheduledAt) >= new Date()
  ).slice(0, 3);

  const doctorName = doctorProfile?.fullName || "Dr. Henderson";
  const doctorSpecialty = doctorProfile?.specialty || "Cardiology Specialist";
  const doctorBio = doctorProfile?.bio || "Expert in cardiovascular health with over 12 years of experience in leading clinical operations, specializing in interventional cardiology and modern wellness therapies.";

  // Group by months Jan - May (0 to 4)
  const janCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 0).length;
  const febCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 1).length;
  const marCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 2).length;
  const aprCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 3).length;
  const mayCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 4).length;

  const maxCount = Math.max(janCount, febCount, marCount, aprCount, mayCount, 1);
  const getY = (count: number) => 130 - (count / maxCount) * 110;

  const y1 = getY(janCount);
  const y2 = getY(febCount);
  const y3 = getY(marCount);
  const y4 = getY(aprCount);
  const y5 = getY(mayCount);

  return (
    <AppShell
      role="doctor"
      title="Doctor dashboard"
      subtitle="Welcome to your CareHub doctor workspace dashboard."
    >
      
      {/* Upper Title Row & Small Profiler badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/20 border border-slate-100 rounded-3xl p-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Doctor Workspace Setup</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Welcome to CareHub, {doctorName}. Let&apos;s get your professional workspace ready for patient consultations.
          </p>
        </div>

        {/* Small profile banner */}
        <div className="flex items-center gap-3 bg-white border border-slate-150 rounded-full px-4 py-2 shadow-xs">
          <div className="h-9 w-9 relative rounded-full overflow-hidden bg-slate-50 border border-slate-200">
            {doctorProfile?.avatarUrl ? (
              <Image 
                src={doctorProfile.avatarUrl} 
                alt={doctorName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#3bf0df]/20 text-[#0b335c] font-bold text-xs">
                {doctorName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">{doctorName}</h4>
            <p className="text-[10px] text-slate-450 font-semibold">{doctorSpecialty}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8-cols width) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Verification Status Banner */}
          <section className="bg-emerald-50/30 border border-emerald-150 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-55/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#0b335c] text-base">Verification Status</h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Pending Final Review</span>
                </span>

                {/* Steps summary checklist grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0b335c]">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span>Medical License Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0b335c]">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span>Identity Documents Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-450 font-medium">
                    <span className="h-4.5 w-4.5 rounded-full border-2 border-slate-300 border-dotted shrink-0 flex items-center justify-center font-bold text-[9px] text-slate-400">...</span>
                    <span>Clinic Inspection Scheduled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding progress gauge */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 min-w-[160px] space-y-1 text-center shrink-0">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Onboarding Progress</span>
              <span className="font-extrabold text-slate-800 text-sm">85%</span>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-500 h-full w-[85%]" />
              </div>
            </div>
          </section>

          {/* Setup Schedule & Service Catalog row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Set Up Your Schedule Card */}
            <div className="bg-[#0b335c] text-white border border-[#092b4f] rounded-3xl p-6 flex flex-col justify-between min-h-[180px] shadow-sm">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl">Set Up Your Schedule</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Define your consultation hours and session buffers to start accepting patient bookings.
                </p>
              </div>
              
              <div className="pt-4">
                <Link 
                  href="/doctor/profile"
                  className="bg-[#3bf0df] hover:bg-[#2ed2c2] text-[#0b335c] font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors"
                >
                  <span>Define Hours</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Service Catalog Card */}
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between min-h-[180px] shadow-sm">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-[#0b335c]">Service Catalog</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Select and price the medical services you&apos;ll provide through the platform.
                </p>
              </div>

              {/* Decorative badges list */}
              <div className="flex gap-1.5 items-center">
                <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs shadow-xs"><Video className="h-3.5 w-3.5" /></div>
                <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shadow-xs"><PhoneCall className="h-3.5 w-3.5" /></div>
                <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shadow-xs"><FileText className="h-3.5 w-3.5" /></div>
                <div className="h-7 w-7 rounded-full bg-slate-50 text-slate-500 font-bold text-[10px] flex items-center justify-center shadow-xs">+4</div>
              </div>

              <div className="pt-2">
                <Link 
                  href="/doctor/profile"
                  className="text-slate-600 hover:text-[#0b335c] font-bold text-xs inline-flex items-center gap-1 transition-colors"
                >
                  <span>Manage Services</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>

          </div>

          {/* Patient Projections Chart */}
          <PatientProjectionsChart appointments={appointments} />

        </div>

        {/* Right Column (4-cols width) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Public Profile Preview Section */}
          <div className="space-y-4">
            <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">Public Profile Preview</span>
            
            {/* Card Mockup */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              
              {/* Doctor Header Banner and Info overlay */}
              <div className="relative h-64 bg-slate-100">
                <Image 
                  src={doctorProfile?.avatarUrl || "/explore_services.png"}
                  alt={doctorName}
                  fill
                  className="object-cover"
                />
                
                {/* Rating "New" badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-[#0b335c] font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>New</span>
                </div>

                {/* Bottom text overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <h4 className="font-serif font-bold text-xl text-white tracking-tight">{doctorName}</h4>
                  <p className="text-slate-200 text-xs mt-0.5 font-medium">{doctorSpecialty}</p>
                </div>
              </div>

              {/* Badges block & Bio preview */}
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {["Telehealth", "In-Clinic", "Emergency"].map((tag) => (
                    <span 
                      key={tag}
                      className="bg-slate-50 border border-slate-150 text-slate-500 font-bold uppercase text-[9px] tracking-wider px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {doctorBio}
                </p>

                <div className="pt-2 border-t border-slate-50">
                  <Link 
                    href="/doctor/profile"
                    className="block w-full text-center border border-[#0b335c] text-[#0b335c] hover:bg-[#0b335c]/5 font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Edit Professional Bio
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Upcoming Consultations list */}
          <section className="bg-white border border-slate-200/85 rounded-3xl p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider">
                Upcoming consultations
              </h3>
              <Link href="/doctor/appointments" className="text-[10px] font-bold text-[#0b335c] hover:underline">
                View all
              </Link>
            </div>
            
            {upcomingPatients.length > 0 ? (
              <div className="space-y-4">
                {upcomingPatients.map((app) => (
                  <div key={app.id} className="flex items-center gap-3.5 p-1 border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xs text-[#0b335c] shrink-0">
                      {app.patientName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">{app.patientName}</p>
                      <p className="truncate text-[10px] text-slate-400 font-semibold mt-0.5">
                        {new Date(app.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {new Date(app.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full shrink-0">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-450 text-xs italic text-center py-4">No upcoming appointments scheduled.</p>
            )}
          </section>

        </div>

      </div>

    </AppShell>
  );
}