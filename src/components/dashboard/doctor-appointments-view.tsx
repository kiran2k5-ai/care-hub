"use client";

import { useState } from "react";
import { AppointmentManagementCard } from "@/components/dashboard/appointment-management-card";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { EmptyState } from "@/components/dashboard/empty-state";
function filterAppointmentsByStatus<T extends { status: string }>(appointments: T[], status: string) {
  return status === "all" ? appointments : appointments.filter((appointment) => appointment.status === status);
}
import type { Appointment } from "@/lib/types";
import { Calendar, List } from "lucide-react";

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Waiting", value: "waiting" },
  { label: "Declined", value: "declined" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function DoctorAppointmentsView({ 
  appointments, 
  initialStatus = "all" 
}: { 
  appointments: Appointment[]; 
  initialStatus?: string;
}) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [status, setStatus] = useState(initialStatus);

  // Filter list client-side
  const filteredAppointments = filterAppointmentsByStatus(appointments, status);

  return (
    <div className="space-y-6">
      {/* View Toggle Header in Box Format */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-none shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Clinical Schedule</h2>
          <p className="text-xs text-slate-500">Manage bookings or view calendar grid</p>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all border rounded-none cursor-pointer ${
              viewMode === "list"
                ? "bg-sky-50 border-sky-100 text-sky-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-100"
            }`}
          >
            <List className="h-4 w-4" />
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all border rounded-none cursor-pointer ${
              viewMode === "calendar"
                ? "bg-sky-50 border-sky-100 text-sky-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-100"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Calendar View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {/* Custom Filter Bar in Box Format */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatus(f.value)}
                className={`inline-flex h-9 items-center px-4 text-xs font-bold transition-colors border rounded-none cursor-pointer ${
                  status === f.value
                    ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <section className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentManagementCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <EmptyState 
                title="No appointments found" 
                description="Patient bookings will appear here once they submit a request." 
              />
            )}
          </section>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm">
          <CalendarView appointments={appointments.filter((app) => app.status === "accepted")} />
        </div>
      )}
    </div>
  );
}
