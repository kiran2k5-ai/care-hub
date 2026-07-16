"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saveDoctorProfileAction, saveAvailabilityAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doctorProfileSchema, availabilitySlotSchema, type DoctorProfileInput, type AvailabilitySlotInput } from "@/lib/validators";

export function DoctorProfileForm({ doctorId, defaultValues }: { doctorId: string; defaultValues?: Partial<DoctorProfileInput> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<DoctorProfileInput>({
    resolver: zodResolver(doctorProfileSchema) as Resolver<DoctorProfileInput>,
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      phone: defaultValues?.phone ?? "",
      specialty: defaultValues?.specialty ?? "",
      qualifications: defaultValues?.qualifications ?? "",
      experienceYears: defaultValues?.experienceYears ?? 0,
      consultationFee: defaultValues?.consultationFee ?? 0,
      clinicAddress: defaultValues?.clinicAddress ?? "",
      bio: defaultValues?.bio ?? "",
      availableDays: defaultValues?.availableDays ?? ["monday", "tuesday", "wednesday"],
      availableHours: defaultValues?.availableHours ?? "09:00-17:00",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: defaultValues?.fullName ?? "",
      phone: defaultValues?.phone ?? "",
      specialty: defaultValues?.specialty ?? "",
      qualifications: defaultValues?.qualifications ?? "",
      experienceYears: defaultValues?.experienceYears ?? 0,
      consultationFee: defaultValues?.consultationFee ?? 0,
      clinicAddress: defaultValues?.clinicAddress ?? "",
      bio: defaultValues?.bio ?? "",
      availableDays: defaultValues?.availableDays ?? ["monday", "tuesday", "wednesday"],
      availableHours: defaultValues?.availableHours ?? "09:00-17:00",
    });
  }, [defaultValues, form]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveDoctorProfileAction({
        ...values,
        availableDays: values.availableDays,
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
      toast.success("Doctor profile saved");
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="doctor-full-name">Full name</Label>
        <Input id="doctor-full-name" {...form.register("fullName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-phone">Phone</Label>
        <Input id="doctor-phone" {...form.register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-specialty">Specialty</Label>
        <Input id="doctor-specialty" {...form.register("specialty")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-qualifications">Qualifications</Label>
        <Input id="doctor-qualifications" {...form.register("qualifications")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-experience">Experience years</Label>
        <Input id="doctor-experience" type="number" {...form.register("experienceYears", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-fee">Consultation fee</Label>
        <Input id="doctor-fee" type="number" {...form.register("consultationFee", { valueAsNumber: true })} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="doctor-clinic">Clinic address</Label>
        <Input id="doctor-clinic" {...form.register("clinicAddress")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="doctor-bio">Bio</Label>
        <Textarea id="doctor-bio" {...form.register("bio")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-availability-days">Available days</Label>
        <Input
          id="doctor-availability-days"
          {...form.register("availableDays")}
          value={(form.watch("availableDays") ?? []).join(",")}
          onChange={(event) => form.setValue("availableDays", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))}
        />
        <p className="text-xs text-slate-500">Comma separated, for example: monday,tuesday,wednesday</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctor-hours">Available hours</Label>
        <Input id="doctor-hours" {...form.register("availableHours")} />
      </div>
      <div className="md:col-span-2 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            const slot: AvailabilitySlotInput = { weekday: 1, startTime: "09:00", endTime: "12:00" };
            const parsed = availabilitySlotSchema.parse(slot);
            const result = await saveAvailabilityAction({ doctorId, ...parsed });
            if (result?.error) {
              toast.error(result.error);
              return;
            }
            router.refresh();
            toast.success("Availability slot saved");
          }}
        >
          Add default slot
        </Button>
      </div>
    </form>
  );
}
