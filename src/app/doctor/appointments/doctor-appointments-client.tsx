"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Calendar, 
  List, 
  Clock, 
  Video,
  X,
  CheckCircle2,
  CalendarRange,
  UserRound,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { updateAppointmentStatusAction } from "@/app/actions";

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

export function DoctorAppointmentsClient({ appointments = [] }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  // Get current date for calendar view rendering
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

  // Handle status actions
  const handleStatusChange = (appointmentId: string, status: Appointment["status"]) => {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction({ appointmentId, status });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`Appointment marked as ${status}`);
      router.refresh();
    });
  };

  // Calendar rendering helpers
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayIndex = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
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
      
      {/* CareHub Logo Header */}
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

      {/* Main Inner Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Top Banner row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Clinical Schedule</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage accepted consultations, review pending requests, or track historical appointments.</p>
          </div>

          {/* Toggle controls */}
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
        </div>

        {/* View mode conditions */}
        {viewMode === "list" ? (
          <div className="space-y-6">
            {/* Tab links */}
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

            {/* List stack */}
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
                        {/* Initial circle avatar */}
                        <div className="h-14 w-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg shrink-0 border border-sky-100">
                          {app.patientName.charAt(0)}
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-800 text-lg">{app.patientName}</h3>
                          <span className="inline-block bg-slate-50 text-slate-550 border border-slate-150 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
                            ID: #PT-{app.patientId.slice(0, 5)}
                          </span>

                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs text-slate-450">
                            <span className="flex items-center gap-1">
                              <Video className="h-3.5 w-3.5" />
                              <span>Virtual Consultation</span>
                            </span>
                            {app.reason && (
                              <span className="block text-slate-500 italic font-medium">"{app.reason}"</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Scheduled info & Actions */}
                      <div className="flex flex-col justify-between items-end gap-4 shrink-0 min-w-[200px]">
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appointment Slot</span>
                          <span className="font-bold text-[#0b335c] text-sm mt-0.5 block">
                            {new Date(app.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="text-slate-500 text-xs block">
                            {new Date(app.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* Status update triggers */}
                        {canModify ? (
                          <div className="flex flex-wrap gap-2 justify-end">
                            {app.status === "pending" && (
                              <button 
                                disabled={isPending}
                                onClick={() => handleStatusChange(app.id, "accepted")}
                                className="bg-[#0b665c] hover:bg-[#084e46] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
                              >
                                Accept
                              </button>
                            )}
                            {app.status === "accepted" && (
                              <button 
                                disabled={isPending}
                                onClick={() => handleStatusChange(app.id, "completed")}
                                className="bg-[#0b665c] hover:bg-[#084e46] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
                              >
                                Complete Visit
                              </button>
                            )}
                            {app.status === "accepted" && (
                              <button 
                                disabled={isPending}
                                onClick={() => handleStatusChange(app.id, "waiting")}
                                className="border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                              >
                                Waiting Room
                              </button>
                            )}
                            <button 
                              disabled={isPending}
                              onClick={() => handleStatusChange(app.id, "declined")}
                              className="border border-rose-150 hover:bg-rose-50 text-rose-600 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            {app.status}
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
                <CalendarRange className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-bold text-[#0b335c]">No schedule slots found</p>
                <p className="text-slate-400 text-xs">Consultation records will list here depending on status.</p>
              </div>
            )}
          </div>
        ) : (
          /* Calendar view showing active dates */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Calendar */}
            <div className="lg:col-span-8 bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-serif font-bold text-xl text-[#0b335c]">{monthYearLabel}</h3>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth("prev")} className="h-8 w-8 rounded-full hover:bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-600">&lt;</button>
                  <button onClick={() => changeMonth("next")} className="h-8 w-8 rounded-full hover:bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-600">&gt;</button>
                </div>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
              </div>

              {/* Grid cell wrapper */}
              <div className="grid grid-cols-7 gap-3">
                {[...Array(firstDayIndex)].map((_, i) => (
                  <div key={`offset-${i}`} className="h-14" />
                ))}

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
                          ? "bg-[#0b665c] text-white border-[#0b665c]"
                          : "bg-slate-50/50 border-slate-100 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className="font-bold text-xs self-start">{dayNum}</span>
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

            {/* Sidebar list for selected calendar day */}
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
                          <div className="h-8 w-8 rounded-full bg-[#0b335c]/10 text-[#0b335c] font-bold text-xs flex items-center justify-center shrink-0">
                            {app.patientName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{app.patientName}</h4>
                            <span className="text-[10px] text-slate-450 font-semibold uppercase">ID: #PT-{app.patientId.slice(0, 5)}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
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
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Cookie Preferences</Link></li>
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
            <h4 className="font-semibold text-slate-800 font-serif text-sm">Portals Workspace</h4>
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
