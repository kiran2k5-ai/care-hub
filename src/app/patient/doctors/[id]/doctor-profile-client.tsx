"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  HeartPulse, 
  UserRound, 
  Star, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Calendar,
  Clock3
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createAppointmentAction, getAvailableSlotsAction } from "@/app/actions";
import { appointmentBookingSchema, type AppointmentBookingInput } from "@/lib/validators";

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  qualifications: string;
  consultationFee: number;
  experienceYears: number;
  clinicAddress: string;
  rating: number;
  nextAvailable: string;
  bio: string;
  availableDays?: string[] | any;
  availableHours?: string | any;
}

export function DoctorProfileClient({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Calculate dynamic 14 days from today
  const calendarDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        label: d.getDate().toString(),
        dateString: d.toISOString().slice(0, 10),
        monthLabel: d.toLocaleDateString("en-US", { month: "short" }),
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(calendarDates[0].dateString);
  const [slots, setSlots] = useState<string[]>([]);

  const form = useForm<AppointmentBookingInput>({
    resolver: zodResolver(appointmentBookingSchema),
    defaultValues: { 
      doctorId: doctor.id, 
      scheduledAt: "", 
      reason: "" 
    },
  });

  const selectedSlot = form.watch("scheduledAt");
  const reasonText = form.watch("reason");
  
  const canSubmit = useMemo(() => {
    return Boolean(selectedSlot) && reasonText.trim().length >= 10;
  }, [reasonText, selectedSlot]);

  // Load slots for the selected date
  useEffect(() => {
    startTransition(async () => {
      const result = await getAvailableSlotsAction({ doctorId: doctor.id, date: selectedDate });
      if (result?.error) {
        toast.error(result.error);
        setSlots([]);
        form.setValue("scheduledAt", "");
        return;
      }
      
      const retrieved = result.slots ?? [];
      setSlots(retrieved);
      
      if (retrieved.length > 0) {
        form.setValue("scheduledAt", retrieved[0]);
      } else {
        form.setValue("scheduledAt", "");
      }
    });
  }, [doctor.id, form, selectedDate]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createAppointmentAction({
        ...values,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Appointment booked successfully!");
      router.push("/patient/appointments");
    });
  });

  // Distribute slots into Morning and Afternoon (purely from the backend slots)
  const morningSlots = useMemo(() => {
    return slots
      .filter((s) => {
        // Parse the slot local hour
        const dateObj = new Date(s);
        const hrs = dateObj.getHours();
        return hrs < 12;
      })
      .map((s) => ({
        time: new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
        iso: s,
      }));
  }, [slots]);

  const afternoonSlots = useMemo(() => {
    return slots
      .filter((s) => {
        const dateObj = new Date(s);
        const hrs = dateObj.getHours();
        return hrs >= 12;
      })
      .map((s) => ({
        time: new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
        iso: s,
      }));
  }, [slots]);

  // Get Month Year label for selected date
  const selectedMonthYearLabel = useMemo(() => {
    return new Date(selectedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [selectedDate]);

  return (
    <main className="min-h-screen bg-slate-50/60 font-sans flex flex-col justify-between">
      {/* Navigation Header - Nav links removed, only Dashboard and Sign Out shown */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/patient/dashboard" className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">
            CareHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/patient/dashboard" 
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
          
          {/* Left Column: Doctor Profile Bio & Qualifications */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Doctor Bio Block */}
            <div className="bg-white border border-slate-250/50 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden">
              <div className="w-full md:w-56 h-64 relative rounded-2xl overflow-hidden shrink-0 shadow-inner bg-slate-100">
                <Image
                  src={doctor.fullName.includes("Alaric") ? "/alaric_thorne.png" : "/explore_services.png"}
                  alt={doctor.fullName}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 inset-x-0 flex justify-center">
                  <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-slate-100">
                    <ShieldCheck className="h-3 w-3 text-emerald-500 fill-emerald-50" />
                    <span>Board Certified</span>
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-emerald-55/90 text-[#0b665c] text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase">
                      {doctor.specialty}
                    </span>
                  </div>
                  <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0b335c] tracking-tight mt-1">
                    {doctor.fullName}
                  </h1>
                </div>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  {doctor.bio || "No biography details provided by this practitioner."}
                </p>

                {/* Experience counter from DB */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 max-w-sm">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</span>
                    <span className="font-bold text-[#0b335c] text-lg mt-0.5 block">{doctor.experienceYears || 0} Years</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consult Fee</span>
                    <span className="font-bold text-[#0b335c] text-lg mt-0.5 block">${doctor.consultationFee}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Qualifications & Education from DB */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-8 space-y-4 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-[#0b335c] flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-slate-400" />
                <span>Qualifications & Education</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {doctor.qualifications || "No qualifications submitted."}
              </p>
            </div>

            {/* Clinic Address block from DB */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-8 space-y-4 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-[#0b335c] flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span>Clinic Address</span>
              </h3>
              <div className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                <p>{doctor.clinicAddress || "Address details not verified."}</p>
              </div>
            </div>

          </div>

          {/* Right Column: Book Appointment Card */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Book Session Card */}
            <div className="bg-white border border-slate-250/50 rounded-3xl p-6 shadow-md space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-serif font-bold text-xl text-[#0b335c]">Book Session</h3>
                <div>
                  <span className="font-bold text-xl text-[#0b335c]">${doctor.consultationFee}</span>
                  <span className="text-xs text-slate-400">/Visit</span>
                </div>
              </div>

              {/* Form container */}
              <form onSubmit={onSubmit} className="space-y-5">
                <input type="hidden" value={doctor.id} {...form.register("doctorId")} />
                
                {/* Month header & navigation */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <span>{selectedMonthYearLabel}</span>
                  </div>

                  {/* Calendar Grid Day Labels */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                    <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
                  </div>

                  {/* Calendar Days Selection Grid - Showing dynamic next 14 days starting from today */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDates.map((day) => {
                      const isActive = selectedDate === day.dateString;
                      return (
                        <button
                          key={day.dateString}
                          type="button"
                          onClick={() => setSelectedDate(day.dateString)}
                          className={`h-8 w-8 text-xs font-bold rounded-full flex flex-col items-center justify-center transition-all ${
                            isActive 
                              ? "bg-[#0b665c] text-white shadow-sm" 
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Slots from DB */}
                <div className="space-y-4">
                  {/* Morning slots */}
                  <div className="space-y-2">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Morning Slots</span>
                    {morningSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {morningSlots.map((slot) => {
                          const isSelected = selectedSlot === slot.iso;
                          return (
                            <button
                              key={slot.iso}
                              type="button"
                              onClick={() => form.setValue("scheduledAt", slot.iso)}
                              className={`py-2 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                                isSelected
                                  ? "bg-[#3bf0df]/15 border-[#3bf0df] text-[#0b665c] font-bold shadow-xs"
                                  : "border-slate-200 text-slate-600 hover:border-slate-350 bg-white"
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="block text-slate-400 text-xs italic">No morning slots available</span>
                    )}
                  </div>

                  {/* Afternoon slots */}
                  <div className="space-y-2">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Afternoon Slots</span>
                    {afternoonSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {afternoonSlots.map((slot) => {
                          const isSelected = selectedSlot === slot.iso;
                          return (
                            <button
                              key={slot.iso}
                              type="button"
                              onClick={() => form.setValue("scheduledAt", slot.iso)}
                              className={`py-2 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all ${
                                isSelected
                                  ? "bg-[#3bf0df]/15 border-[#3bf0df] text-[#0b665c] font-bold shadow-xs"
                                  : "border-slate-200 text-slate-600 hover:border-slate-350 bg-white"
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="block text-slate-400 text-xs italic">No afternoon slots available</span>
                    )}
                  </div>
                </div>

                {/* Reason Text Area */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="reason">
                    Reason for visit
                  </label>
                  <textarea
                    id="reason"
                    rows={2}
                    required
                    placeholder="Describe your symptoms (min 10 characters)..."
                    {...form.register("reason")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-350 resize-none"
                  />
                  {reasonText.trim().length > 0 && reasonText.trim().length < 10 && (
                    <span className="block text-[10px] text-red-500 font-medium">Must be at least 10 characters</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPending || !canSubmit}
                  className="w-full bg-[#0b665c] hover:bg-[#084e46] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isPending ? "Booking..." : "Book Appointment"}
                </button>

                <span className="block text-center text-[10px] text-slate-400 font-medium">
                  Free cancellation up to 24h before
                </span>
              </form>

            </div>

            {/* Coordinator banner */}
            <div className="bg-[#0b335c] rounded-3xl p-6 text-white space-y-4 shadow-sm relative overflow-hidden">
              <span className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider">Need help booking?</span>
              <h4 className="font-serif font-bold text-lg leading-snug">
                Speak with a Care Coordinator
              </h4>
              <Link 
                href="#"
                className="inline-flex items-center gap-1.5 text-xs text-[#3bf0df] font-bold hover:underline"
              >
                <span>Contact Support</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
            <p className="leading-relaxed">
              Elevating healthcare standards through innovation and empathy. Personalized care at your fingertips.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/patient/doctors" className="hover:text-[#0b335c] transition-colors">About Us</Link></li>
              <li><Link href="/patient/doctors" className="hover:text-[#0b335c] transition-colors">Find a Doctor</Link></li>
              <li><Link href="/patient/services" className="hover:text-[#0b335c] transition-colors">Medical Services</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Patient Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Patient Resources</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800">Newsletter</h4>
            <p className="leading-relaxed">Stay updated with health tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-slate-350 w-full"
              />
              <button className="bg-[#0b335c] hover:bg-[#061e38] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-100 mt-8 pt-6 text-center text-[10px] text-slate-400">
          <p>&copy; 2024 CareHub Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
