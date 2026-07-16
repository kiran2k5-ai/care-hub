"use client";

import { useEffect, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  UserRound, 
  Phone, 
  MapPin, 
  Activity, 
  FileText, 
  Clock, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  Plus, 
  Info 
} from "lucide-react";
import Link from "next/link";
import { saveDoctorProfileAction, saveAvailabilityAction } from "@/app/actions";
import { doctorProfileSchema, type DoctorProfileInput } from "@/lib/validators";

export function DoctorProfileClient({ 
  doctorId, 
  profile 
}: { 
  doctorId: string; 
  profile?: Partial<DoctorProfileInput>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<DoctorProfileInput>({
    resolver: zodResolver(doctorProfileSchema) as Resolver<DoctorProfileInput>,
    defaultValues: {
      fullName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      specialty: profile?.specialty ?? "",
      qualifications: profile?.qualifications ?? "",
      experienceYears: profile?.experienceYears ?? 0,
      consultationFee: profile?.consultationFee ?? 0,
      clinicAddress: profile?.clinicAddress ?? "",
      bio: profile?.bio ?? "",
      availableDays: profile?.availableDays ?? ["monday", "tuesday", "wednesday"],
      availableHours: profile?.availableHours ?? "09:00-17:00",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      specialty: profile?.specialty ?? "",
      qualifications: profile?.qualifications ?? "",
      experienceYears: profile?.experienceYears ?? 0,
      consultationFee: profile?.consultationFee ?? 0,
      clinicAddress: profile?.clinicAddress ?? "",
      bio: profile?.bio ?? "",
      availableDays: profile?.availableDays ?? ["monday", "tuesday", "wednesday"],
      availableHours: profile?.availableHours ?? "09:00-17:00",
    });
  }, [profile, form]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveDoctorProfileAction({
        ...values,
        availableDays: values.availableDays,
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated successfully");
      router.refresh();
    });
  });

  const handleAddDefaultSlot = () => {
    startTransition(async () => {
      const slot = { weekday: 1, startTime: "09:00", endTime: "12:00" };
      const result = await saveAvailabilityAction({ doctorId, ...slot });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Default morning availability slot added");
      router.refresh();
    });
  };

  const selectedDays = form.watch("availableDays") ?? [];

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/doctor/dashboard" className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">
            CareHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/doctor/dashboard" 
            className="border border-slate-200 hover:bg-slate-50 text-[#0b335c] text-xs font-semibold px-4.5 py-2 rounded-full transition-colors shadow-sm"
          >
            Dashboard
          </Link>
          <Link 
            href="/login" 
            className="bg-[#0b335c] hover:bg-[#061e38] text-white text-xs font-semibold px-4.5 py-2 rounded-full transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8-cols width): Form block */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Profile & Work Availability</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Configure your specialties, biography preview, session fees, and active clinic locations.</p>
            </div>

            <section className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-sm">
              <form onSubmit={onSubmit} className="space-y-6">
                
                {/* 2 columns layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("fullName")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("phone")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Medical Specialty</label>
                    <div className="relative">
                      <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("specialty")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Qualifications</label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("qualifications")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Experience Years */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Years</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="number" 
                        {...form.register("experienceYears", { valueAsNumber: true })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Consultation Fee */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Consultation Fee ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="number" 
                        {...form.register("consultationFee", { valueAsNumber: true })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                </div>

                {/* Full Width elements */}
                <div className="space-y-6">
                  {/* Clinic Address */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Clinic Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("clinicAddress")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Bio</label>
                    <textarea 
                      {...form.register("bio")}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350 resize-none"
                    />
                  </div>

                  {/* Availability settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Available Days</label>
                      <input 
                        type="text"
                        value={selectedDays.join(",")}
                        onChange={(e) => form.setValue("availableDays", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                      <p className="text-[10px] text-slate-400 font-semibold italic">Comma separated list (e.g. monday,tuesday,wednesday)</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Available Hours range</label>
                      <input 
                        type="text"
                        {...form.register("availableHours")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                      <p className="text-[10px] text-slate-400 font-semibold italic">Example range: 09:00-17:00</p>
                    </div>
                  </div>

                </div>

                {/* Submits */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#0b665c] hover:bg-[#084e46] text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>{isPending ? "Saving changes..." : "Save Profile Details"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddDefaultSlot}
                    className="border border-[#0b335c] text-[#0b335c] hover:bg-[#0b335c]/5 font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>Add Default Slot</span>
                  </button>
                </div>

              </form>
            </section>
          </div>

          {/* Right Column (4-cols width): informational sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Working slot summary */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0b335c] flex items-center gap-2 border-b border-slate-50 pb-3">
                <Clock className="h-5 w-5 text-[#009688]" />
                <span>Working Slots Summary</span>
              </h3>
              
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-[#0b335c]">Available hours</span>
                  <span className="text-slate-500 font-medium">{form.watch("availableHours") || "09:00-17:00"}</span>
                </div>
                
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Days Summary</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedDays.map((day) => (
                      <span key={day} className="bg-emerald-50 text-emerald-700 font-bold uppercase text-[9px] tracking-wider px-2.5 py-1 rounded-full border border-emerald-100">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile guide brief */}
            <div className="bg-cyan-50/40 border border-cyan-150 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-[#009688]" />
                <span>Clinician Guide</span>
              </h3>
              <p className="text-slate-550 text-xs leading-relaxed">
                Profile summaries, clinic addresses, and consultation rates are shared directly with patients on the Specialists Booking directory page. Maintaining accurate details helps improve client booking matches.
              </p>
            </div>

            {/* HIPAA Compliance card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
              <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-[#0b335c] text-sm">HIPAA Secure</h4>
              <p className="text-slate-450 text-[10px] leading-relaxed">
                Information entered here is encrypted and processed according to healthcare records confidentiality protocols.
              </p>
            </div>

          </aside>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 w-full mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
            <p className="leading-relaxed">
              Providing world-class clinician workspace management with high reliability and secure systems.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Staff Policies</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Staff Help Desk</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Clinical Operations</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 font-serif text-sm">Clinical Systems</h4>
            <p className="leading-relaxed text-emerald-600 font-bold uppercase tracking-widest">
              HIPAA Compliant System
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-100 mt-8 pt-6 text-center text-[10px] text-slate-400">
          <p>&copy; 2024 CareHub Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
