"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { cancelAppointmentAction, rescheduleAppointmentAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/lib/types";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredAppointment, setHoveredAppointment] = useState<string | null>(null);
  const [rescheduleValues, setRescheduleValues] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstDayOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ key: string; date: Date; inMonth: boolean }> = [];

    for (let index = 0; index < firstDayOffset; index += 1) {
      const date = new Date(year, month, index - firstDayOffset + 1);
      cells.push({ key: `prev-${index}`, date, inMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ key: `day-${day}`, date: new Date(year, month, day), inMonth: true });
    }

    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - (daysInMonth + firstDayOffset) + 1;
      cells.push({ key: `next-${nextDay}`, date: new Date(year, month + 1, nextDay), inMonth: false });
    }

    return cells;
  }, [currentDate]);

  const selectedAppointments = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return appointments.filter((appointment) => appointment.scheduledAt.slice(0, 10) === selectedDate);
  }, [appointments, selectedDate]);

  const dayAppointments = (date: Date) => appointments.filter((appointment) => appointment.scheduledAt.slice(0, 10) === date.toISOString().slice(0, 10));

  const handleCancel = (appointmentId: string) => {
    startTransition(async () => {
      const result = await cancelAppointmentAction({ appointmentId });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Appointment cancelled");
      setSelectedDate((current) => current);
    });
  };

  const handleReschedule = (appointmentId: string) => {
    startTransition(async () => {
      const scheduledAt = rescheduleValues[appointmentId] ?? new Date().toISOString().slice(0, 16);
      const result = await rescheduleAppointmentAction({ appointmentId, scheduledAt: new Date(scheduledAt).toISOString() });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Appointment rescheduled");
      setSelectedDate((current) => current);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-950">{currentDate.toLocaleDateString([], { month: "long", year: "numeric" })}</p>
          <p className="text-sm text-slate-500">Accepted appointments appear in the month grid.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
            Previous
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
            Next
          </Button>
        </div>
      </div>
      <div className="pb-4">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
        {dayNames.map((day) => (
          <div key={day} className="rounded-2xl border border-slate-200 bg-slate-50 px-1 py-2 text-center text-xs sm:text-sm font-semibold text-slate-700">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
        {monthData.map((cell) => {
          const appointmentsForDay = dayAppointments(cell.date);
          const isSelected = selectedDate === cell.date.toISOString().slice(0, 10);
          return (
            <div key={cell.key} onClick={() => setSelectedDate(cell.date.toISOString().slice(0, 10))} className={`min-h-16 md:min-h-28 rounded-xl md:rounded-2xl border p-1 md:p-2 text-left cursor-pointer transition hover:border-sky-200 ${cell.inMonth ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-slate-50 text-slate-400"} ${isSelected ? "ring-2 ring-sky-200" : ""}`}>
              <div className="flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-2">
                <span className="text-xs md:text-sm font-semibold">{cell.date.getDate()}</span>
                {appointmentsForDay.length > 0 ? <Badge className="bg-sky-50 text-sky-700 px-1 text-[10px] md:text-xs">{appointmentsForDay.length}</Badge> : null}
              </div>
              <div className="mt-2 space-y-1 hidden md:block">
                {appointmentsForDay.slice(0, 2).map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="rounded-xl bg-sky-50 px-2 py-1 text-xs text-slate-700 transition hover:bg-sky-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredAppointment((prev) => (prev === appointment.id ? null : appointment.id));
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{new Date(appointment.scheduledAt).toLocaleTimeString([], { timeZone: "UTC", hour: "numeric", minute: "2-digit" })} • {appointment.patientName}</span>
                    </div>
                    {hoveredAppointment === appointment.id && (
                      <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[10px]"
                          disabled={isPending}
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-7 px-2 text-[10px]"
                          disabled={isPending}
                          onClick={() => handleReschedule(appointment.id)}
                        >
                          Reschedule
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      <Card>
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold text-slate-950">{selectedDate ? `Appointments on ${new Date(selectedDate).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}` : "Choose a day to view details"}</p>
          {selectedAppointments.length > 0 ? selectedAppointments.map((appointment) => (
            <div key={appointment.id} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-950">{appointment.patientName}</p>
                <p className="text-sm text-slate-600">{new Date(appointment.scheduledAt).toLocaleTimeString([], { timeZone: "UTC", hour: "numeric", minute: "2-digit" })}</p>
              </div>
              <p className="text-sm text-slate-600">{appointment.reason}</p>
              <div className="grid gap-3 rounded-2xl bg-white p-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                <Input
                  type="datetime-local"
                  value={rescheduleValues[appointment.id] ?? new Date(appointment.scheduledAt).toISOString().slice(0, 16)}
                  onChange={(event) => setRescheduleValues((prev) => ({ ...prev, [appointment.id]: event.target.value }))}
                />
                <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => handleReschedule(appointment.id)}>
                  Reschedule
                </Button>
                <Button type="button" size="sm" variant="destructive" disabled={isPending} onClick={() => handleCancel(appointment.id)}>
                  Cancel
                </Button>
              </div>
            </div>
          )) : <p className="text-sm text-slate-500">No accepted appointments for this day.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
