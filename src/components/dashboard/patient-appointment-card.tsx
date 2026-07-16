"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cancelAppointmentAction, rescheduleAppointmentAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/lib/types";

const statusClasses: Record<Appointment["status"], string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-800 border-emerald-200",
  declined: "bg-rose-50 text-rose-800 border-rose-200",
  waiting: "bg-sky-50 text-sky-800 border-sky-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
};

export function PatientAppointmentCard({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rescheduleValue, setRescheduleValue] = useState(() => new Date(appointment.scheduledAt).toISOString().slice(0, 16));

  const canModify = useMemo(() => ["pending", "accepted", "waiting"].includes(appointment.status), [appointment.status]);

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelAppointmentAction({ appointmentId: appointment.id });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
      toast.success("Appointment cancelled");
    });
  };

  const handleReschedule = () => {
    startTransition(async () => {
      const result = await rescheduleAppointmentAction({
        appointmentId: appointment.id,
        scheduledAt: new Date(rescheduleValue).toISOString(),
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
      toast.success("Appointment rescheduled");
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">{appointment.doctorName}</p>
            <p className="mt-1 text-sm text-slate-500">{appointment.reason}</p>
          </div>
          <Badge className={statusClasses[appointment.status]}>{appointment.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span>{appointment.specialty}</span>
          <span>•</span>
          <span>{new Date(appointment.scheduledAt).toLocaleString([], { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
        {canModify ? (
          <div className="grid gap-3 rounded-none bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <Input type="datetime-local" value={rescheduleValue} onChange={(event) => setRescheduleValue(event.target.value)} />
            <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleReschedule}>
              Reschedule
            </Button>
            <Button type="button" variant="destructive" size="sm" disabled={isPending} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
