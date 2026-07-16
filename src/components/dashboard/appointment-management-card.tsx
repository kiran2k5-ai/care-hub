"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateAppointmentStatusAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const statuses: Array<Appointment["status"]> = ["accepted", "completed", "declined", "waiting"];

export function AppointmentManagementCard({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: Appointment["status"]) => {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction({ appointmentId: appointment.id, status });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
      toast.success(`Appointment marked as ${status}`);
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
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
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button key={status} variant={status === "accepted" ? "default" : "outline"} size="sm" disabled={isPending} onClick={() => handleStatusChange(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
