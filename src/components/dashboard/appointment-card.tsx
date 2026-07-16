import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Appointment } from "@/lib/types";

const statusClasses: Record<Appointment["status"], string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-800 border-emerald-200",
  declined: "bg-rose-50 text-rose-800 border-rose-200",
  waiting: "bg-sky-50 text-sky-800 border-sky-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
};

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">{appointment.patientName}</p>
            <p className="mt-1 text-sm text-slate-500">{appointment.reason}</p>
          </div>
          <Badge className={statusClasses[appointment.status]}>{appointment.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span>{appointment.specialty}</span>
          <span>•</span>
          <span>{new Date(appointment.scheduledAt).toLocaleString([], { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
