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

const WEEKDAYS = [
  { label: "Monday", value: "monday", weekdayIndex: 1 },
  { label: "Tuesday", value: "tuesday", weekdayIndex: 2 },
  { label: "Wednesday", value: "wednesday", weekdayIndex: 3 },
  { label: "Thursday", value: "thursday", weekdayIndex: 4 },
  { label: "Friday", value: "friday", weekdayIndex: 5 },
  { label: "Saturday", value: "saturday", weekdayIndex: 6 },
  { label: "Sunday", value: "sunday", weekdayIndex: 0 },
];

function generateHoursSummary(slots: { weekday: number; startTime: string; endTime: string }[]) {
  if (slots.length === 0) return "Closed";
  
  const firstTimeRange = `${slots[0].startTime}-${slots[0].endTime}`;
  const allSame = slots.every(s => `${s.startTime}-${s.endTime}` === firstTimeRange);
  
  if (allSame) {
    return firstTimeRange;
  }
  
  const dayMapShort: Record<number, string> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    0: "Sun",
  };

  const sorted = [...slots].sort((a, b) => {
    const getSortOrder = (w: number) => w === 0 ? 7 : w;
    return getSortOrder(a.weekday) - getSortOrder(b.weekday);
  });

  const parts = sorted.map(s => `${dayMapShort[s.weekday]}: ${s.startTime}-${s.endTime}`);
  const merged = parts.join(", ");
  
  if (merged.length > 50) {
    return merged.substring(0, 47) + "...";
  }
  return merged;
}

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
      weeklySlots: (profile as any)?.weeklySlots ?? [],
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
      weeklySlots: (profile as any)?.weeklySlots ?? [],
    });
  }, [profile, form]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveDoctorProfileAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated successfully");
      router.refresh();
    });
  });

  const handleWeekdayToggle = (weekdayIndex: number, checked: boolean) => {
    const currentSlots = form.getValues("weeklySlots") ?? [];
    let updatedSlots = [...currentSlots];
    if (checked) {
      if (!updatedSlots.some(s => s.weekday === weekdayIndex)) {
        updatedSlots.push({ weekday: weekdayIndex, startTime: "09:00", endTime: "17:00" });
      }
    } else {
      updatedSlots = updatedSlots.filter(s => s.weekday !== weekdayIndex);
    }
    
    updatedSlots.sort((a, b) => {
      const getSortOrder = (w: number) => w === 0 ? 7 : w;
      return getSortOrder(a.weekday) - getSortOrder(b.weekday);
    });

    form.setValue("weeklySlots", updatedSlots, { shouldDirty: true, shouldValidate: true });

    const dayMapRev: Record<number, string> = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      0: "sunday",
    };
    const days = updatedSlots.map(s => dayMapRev[s.weekday]);
    form.setValue("availableDays", days, { shouldDirty: true, shouldValidate: true });
    form.setValue("availableHours", generateHoursSummary(updatedSlots), { shouldDirty: true, shouldValidate: true });
  };

  const handleTimeChange = (weekdayIndex: number, field: "startTime" | "endTime", value: string) => {
    const currentSlots = form.getValues("weeklySlots") ?? [];
    const updatedSlots = currentSlots.map(s => {
      if (s.weekday === weekdayIndex) {
        return { ...s, [field]: value };
      }
      return s;
    });
    form.setValue("weeklySlots", updatedSlots, { shouldDirty: true, shouldValidate: true });
    form.setValue("availableHours", generateHoursSummary(updatedSlots), { shouldDirty: true, shouldValidate: true });
  };

  const handleAddDefaultSlot = () => {
    const currentSlots = form.getValues("weeklySlots") ?? [];
    if (!currentSlots.some(s => s.weekday === 1)) {
      const updated = [...currentSlots, { weekday: 1, startTime: "09:00", endTime: "12:00" }];
      updated.sort((a, b) => {
        const getSortOrder = (w: number) => w === 0 ? 7 : w;
        return getSortOrder(a.weekday) - getSortOrder(b.weekday);
      });
      form.setValue("weeklySlots", updated, { shouldDirty: true, shouldValidate: true });
      
      const dayMapRev: Record<number, string> = {
        1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday", 0: "sunday"
      };
      form.setValue("availableDays", updated.map(s => dayMapRev[s.weekday]), { shouldDirty: true, shouldValidate: true });
      form.setValue("availableHours", generateHoursSummary(updated), { shouldDirty: true, shouldValidate: true });
      toast.success("Default Monday morning slot added to schedule list");
    } else {
      toast.info("Monday morning slot is already added or active");
    }
  };

  const selectedDays = form.watch("availableDays") ?? [];
  const weeklySlots = form.watch("weeklySlots") ?? [];

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

                  {/* Daily Availability Settings */}
                  <div className="pt-6 border-t border-slate-150 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest">Daily Visiting Hours</label>
                      <p className="text-slate-500 text-[10px] sm:text-xs mt-1">
                        Configure customized timing slots for each weekday. Deselect a day if you do not offer consultations on that day.
                      </p>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 md:p-6 space-y-4">
                      {WEEKDAYS.map((day) => {
                        const activeSlot = weeklySlots.find(s => s.weekday === day.weekdayIndex);
                        const isActive = !!activeSlot;
                        
                        return (
                          <div key={day.value} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                            {/* Day toggle */}
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <input 
                                type="checkbox"
                                id={`weekday-${day.value}`}
                                checked={isActive}
                                onChange={(e) => handleWeekdayToggle(day.weekdayIndex, e.target.checked)}
                                className="h-4.5 w-4.5 rounded border-slate-300 text-[#0b665c] focus:ring-[#0b665c] cursor-pointer"
                              />
                              <label htmlFor={`weekday-${day.value}`} className="text-xs font-bold text-slate-750 cursor-pointer select-none">
                                {day.label}
                              </label>
                            </div>

                            {/* Time inputs */}
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <input 
                                  type="time"
                                  value={activeSlot?.startTime ?? "09:00"}
                                  disabled={!isActive}
                                  onChange={(e) => handleTimeChange(day.weekdayIndex, "startTime", e.target.value)}
                                  className="bg-white border border-slate-200 disabled:opacity-50 disabled:bg-slate-100 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                                />
                              </div>
                              <span className="text-slate-405 text-xs font-medium">to</span>
                              <div className="relative">
                                <input 
                                  type="time"
                                  value={activeSlot?.endTime ?? "17:00"}
                                  disabled={!isActive}
                                  onChange={(e) => handleTimeChange(day.weekdayIndex, "endTime", e.target.value)}
                                  className="bg-white border border-slate-200 disabled:opacity-50 disabled:bg-slate-100 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                  <span className="font-bold text-[#0b335c]">Hours summary</span>
                  <span className="text-slate-500 font-medium truncate max-w-[150px]" title={form.watch("availableHours") || "Closed"}>
                    {form.watch("availableHours") || "Closed"}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Days Schedule</span>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {weeklySlots.length > 0 ? (
                      weeklySlots.map((slot) => {
                        const dayName = WEEKDAYS.find(d => d.weekdayIndex === slot.weekday)?.label ?? "Day";
                        return (
                          <div key={slot.weekday} className="flex justify-between items-center bg-emerald-50/40 border border-emerald-100 p-2.5 rounded-xl text-[11px]">
                            <span className="font-bold text-emerald-800 uppercase tracking-wider">{dayName}</span>
                            <span className="text-emerald-700 font-bold">{slot.startTime} - {slot.endTime}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 italic text-[11px]">
                        No visiting hours configured.
                      </div>
                    )}
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
