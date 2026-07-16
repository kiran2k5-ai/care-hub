"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Calendar, 
  List, 
  Plus, 
  MapPin, 
  CalendarDays, 
  Clock, 
  Video,
  X,
  RefreshCw,
  CheckCircle2,
  CalendarRange
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cancelAppointmentAction, rescheduleAppointmentAction } from "@/app/actions";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientId: string;
  patientName: string;
  status: "pending" | "accepted" | "declined" | "waiting" | "cancelled" | "completed";
  scheduledAt: string;
  reason: string;
}

export function PatientAppointmentsClient({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  
  // Reschedule form states
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDateTime, setNewDateTime] = useState("");

  // Get current date for month calendar rendering
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    today.toISOString().slice(0, 10)
  );

  // Group appointments by status/tab
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const isPast = new Date(app.scheduledAt) < today;
      if (activeTab === "upcoming") {
        return ["pending", "accepted", "waiting"].includes(app.status) && !isPast;
      }
      if (activeTab === "past") {
        return app.status === "completed" || (["accepted", "pending", "waiting"].includes(app.status) && isPast);
      }
      return ["cancelled", "declined"].includes(app.status);
    });
  }, [appointments, activeTab]);

  // Cancel Handler
  const handleCancel = (appointmentId: string) => {
    startTransition(async () => {
      const result = await cancelAppointmentAction({ appointmentId });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Appointment cancelled successfully");
      router.refresh();
    });
  };

  // Reschedule Handler
  const handleReschedule = (appointmentId: string) => {
    if (!newDateTime) {
      toast.error("Please select a date and time");
      return;
    }
    startTransition(async () => {
      const result = await rescheduleAppointmentAction({
        appointmentId,
        scheduledAt: new Date(newDateTime).toISOString(),
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Appointment rescheduled successfully");
      setReschedulingId(null);
      setNewDateTime("");
      router.refresh();
    });
  };

  // Calendar rendering helpers
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayIndex = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  }, [currentYear, currentMonth]);

  const monthYearLabel = useMemo(() => {
    return new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [currentYear, currentMonth]);

  // Map appointments to date string key: "YYYY-MM-DD"
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((app) => {
      const key = new Date(app.scheduledAt).toISOString().slice(0, 10);
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(app);
    });
    return map;
  }, [appointments]);

  // Appointments on selected calendar date
  const selectedDateAppointments = useMemo(() => {
    return appointmentsByDate[selectedCalendarDate] ?? [];
  }, [appointmentsByDate, selectedCalendarDate]);

  const changeMonth = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      {/* Navigation Header */}
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

      {/* Main Inner Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Top Banner section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">My Appointments</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Review upcoming consultations, history records, or update booking details.</p>
          </div>

        {/* Action Toggle buttons */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/80 rounded-xl p-1 flex items-center shadow-xs">
            <button 
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-slate-100 text-[#0b335c]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "calendar"
                  ? "bg-slate-100 text-[#0b335c]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
          </div>

          <Link 
            href="/patient/doctors" 
            className="bg-[#3bf0df] hover:bg-[#2ed2c2] text-[#0b335c] font-bold text-xs px-4.5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Main content logic */}
      {viewMode === "list" ? (
        <div className="space-y-6">
          {/* Tab selections */}
          <div className="border-b border-slate-200 flex gap-6 text-sm">
            {(["upcoming", "past", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-bold border-b-2 capitalize transition-all ${
                  activeTab === tab
                    ? "border-[#009688] text-[#009688]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab} ({appointments.filter(app => {
                  const isPast = new Date(app.scheduledAt) < today;
                  if (tab === "upcoming") return ["pending", "accepted", "waiting"].includes(app.status) && !isPast;
                  if (tab === "past") return app.status === "completed" || (["accepted", "pending", "waiting"].includes(app.status) && isPast);
                  return ["cancelled", "declined"].includes(app.status);
                }).length})
              </button>
            ))}
          </div>

          {/* Cards List */}
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((app) => {
                const canModify = ["pending", "accepted", "waiting"].includes(app.status);
                return (
                  <div 
                    key={app.id} 
                    className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="h-16 w-16 relative rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <Image 
                          src={app.doctorName.includes("Alaric") ? "/alaric_thorne.png" : "/explore_services.png"}
                          alt={app.doctorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Info text */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-lg">{app.doctorName}</h3>
                        <span className="inline-block bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
                          {app.specialty}
                        </span>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-450">
                          <span className="flex items-center gap-1">
                            <Video className="h-3.5 w-3.5" />
                            <span>Virtual Consultation</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>45 minutes</span>
                          </span>
                          {app.reason && (
                            <span className="block text-slate-500 italic mt-1 font-medium">"{app.reason}"</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Booking schedule & action triggers */}
                    <div className="flex flex-col justify-between items-end gap-4 shrink-0 min-w-[200px]">
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Date</span>
                        <span className="font-bold text-[#0b335c] text-sm mt-0.5 block">
                          {new Date(app.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="text-slate-500 text-xs block">
                          {new Date(app.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Action buttons list (NO JOIN CALL BUTTON) */}
                      <div className="flex gap-2">
                        {canModify && (
                          <>
                            <button
                              onClick={() => {
                                setReschedulingId(app.id);
                                setNewDateTime(new Date(app.scheduledAt).toISOString().slice(0, 16));
                              }}
                              className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                            >
                              Reschedule
                            </button>
                            <button
                              disabled={isPending}
                              onClick={() => handleCancel(app.id)}
                              className="border border-rose-150 hover:bg-rose-50 text-rose-600 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {!canModify && (
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            {app.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Inline Reschedule Dialog panel */}
                    {reschedulingId === app.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-bold text-[#0b335c]">Reschedule Appointment</h4>
                            <button onClick={() => setReschedulingId(null)} className="p-1 hover:bg-slate-100 rounded-full">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select New Date & Time</label>
                            <input 
                              type="datetime-local" 
                              value={newDateTime}
                              onChange={(e) => setNewDateTime(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-slate-350"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button 
                              onClick={() => setReschedulingId(null)}
                              className="text-xs font-semibold text-slate-500 px-4 py-2 hover:bg-slate-50 rounded-xl"
                            >
                              Close
                            </button>
                            <button 
                              disabled={isPending}
                              onClick={() => handleReschedule(app.id)}
                              className="bg-[#0b665c] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#084e46] transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
              <CalendarRange className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-bold text-[#0b335c]">No appointments found</p>
              <p className="text-slate-400 text-xs">There are no appointments listed under this category.</p>
            </div>
          )}
        </div>
      ) : (
        /* Calendar view showing current date and highlight booked days */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar grid (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-serif font-bold text-xl text-[#0b335c]">{monthYearLabel}</h3>
              <div className="flex gap-2">
                <button onClick={() => changeMonth("prev")} className="h-8 w-8 rounded-full hover:bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-600">&lt;</button>
                <button onClick={() => changeMonth("next")} className="h-8 w-8 rounded-full hover:bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-600">&gt;</button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
            </div>

            {/* Monthly Dates Grid */}
            <div className="grid grid-cols-7 gap-3">
              {/* Empty padding boxes for first week offset */}
              {[...Array(firstDayIndex)].map((_, i) => (
                <div key={`offset-${i}`} className="h-14" />
              ))}

              {/* Day cells */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const paddedDay = dayNum.toString().padStart(2, "0");
                const paddedMonth = (currentMonth + 1).toString().padStart(2, "0");
                const dateStr = `${currentYear}-${paddedMonth}-${paddedDay}`;
                
                const hasBooking = Boolean(appointmentsByDate[dateStr]);
                const isSelected = selectedCalendarDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedCalendarDate(dateStr)}
                    className={`h-14 rounded-2xl flex flex-col items-center justify-between p-2.5 transition-all relative border ${
                      isSelected
                        ? "bg-[#0b665c] text-white border-[#0b665c] shadow-xs"
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className="font-bold text-xs self-start">{dayNum}</span>
                    
                    {/* Highlight booked days */}
                    {hasBooking && (
                      <span className={`h-2 w-2 rounded-full absolute bottom-2 ${
                        isSelected ? "bg-white" : "bg-[#3bf0df]"
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appointments list for the selected calendar day (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider">
                  Bookings for {new Date(selectedCalendarDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </h3>
              </div>

              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateAppointments.map((app) => (
                    <div key={app.id} className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#3bf0df]/20 text-[#0b335c] font-bold text-xs flex items-center justify-center shrink-0">
                          {app.doctorName.slice(4, 6)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{app.doctorName}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{app.specialty}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(app.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                        <span className="bg-white border border-slate-150 px-2 py-0.5 rounded-full text-slate-500 font-bold uppercase tracking-wider">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-450 text-xs italic text-center py-4">No appointments scheduled for this day.</p>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
