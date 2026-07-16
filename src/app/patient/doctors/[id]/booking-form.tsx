"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createAppointmentAction, getAvailableSlotsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appointmentBookingSchema, type AppointmentBookingInput } from "@/lib/validators";

const defaultDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

export function BookingForm({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState(defaultDateTime.slice(0, 10));
  const [slots, setSlots] = useState<string[]>([]);
  const form = useForm<AppointmentBookingInput>({
    resolver: zodResolver(appointmentBookingSchema),
    defaultValues: { doctorId, scheduledAt: defaultDateTime, reason: "" },
  });

  const selectedSlot = form.watch("scheduledAt");
  const reasonText = form.watch("reason");
  const canSubmit = useMemo(() => Boolean(selectedSlot) && reasonText.trim().length >= 10, [reasonText, selectedSlot]);

  useEffect(() => {
    startTransition(async () => {
      const result = await getAvailableSlotsAction({ doctorId, date: selectedDate });
      if (result?.error) {
        toast.error(result.error);
        setSlots([]);
        form.setValue("scheduledAt", "");
        return;
      }

      setSlots(result.slots ?? []);
      if (result.slots?.length) {
        form.setValue("scheduledAt", result.slots[0]);
      } else {
        form.setValue("scheduledAt", "");
      }
    });
  }, [doctorId, form, selectedDate]);

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

      router.refresh();
      form.reset({ doctorId, scheduledAt: "", reason: "" });
      setSelectedDate(defaultDateTime.slice(0, 10));
      setSlots([]);
      toast.success("Appointment request sent");
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input type="hidden" value={doctorId} {...form.register("doctorId")} />
      <div className="space-y-2">
        <Label htmlFor="booking-date">Select date</Label>
        <Input id="booking-date" type="date" value={selectedDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setSelectedDate(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="booking-slot">Available time</Label>
        <select id="booking-slot" value={selectedSlot ?? ""} onChange={(event) => form.setValue("scheduledAt", event.target.value)} className="flex h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300">
          {slots.length > 0 ? slots.map((slot) => <option key={slot} value={slot}>{new Date(slot).toLocaleString([], { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })}</option>) : <option value="">No available slots</option>}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="booking-reason">Reason for visit</Label>
        <Textarea id="booking-reason" placeholder="Reason for visit" {...form.register("reason")} />
      </div>
      <Button className="w-full" type="submit" disabled={isPending || !canSubmit || !slots.length}>
        {isPending ? "Submitting..." : "Submit booking request"}
      </Button>
    </form>
  );
}
