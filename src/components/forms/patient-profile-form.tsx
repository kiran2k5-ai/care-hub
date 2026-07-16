"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { savePatientProfileAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { patientProfileSchema, type PatientProfileInput } from "@/lib/validators";

export function PatientProfileForm({ defaultValues }: { defaultValues?: Partial<PatientProfileInput> }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PatientProfileInput>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      phone: defaultValues?.phone ?? "",
      dateOfBirth: defaultValues?.dateOfBirth ?? "",
      gender: defaultValues?.gender,
      bloodGroup: defaultValues?.bloodGroup ?? "",
      allergies: defaultValues?.allergies ?? "",
      emergencyContact: defaultValues?.emergencyContact ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await savePatientProfileAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Patient profile saved");
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="patient-full-name">Full name</Label>
        <Input id="patient-full-name" {...form.register("fullName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-phone">Phone</Label>
        <Input id="patient-phone" {...form.register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-dob">Date of birth</Label>
        <Input id="patient-dob" type="date" {...form.register("dateOfBirth")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-gender">Gender</Label>
        <Input id="patient-gender" {...form.register("gender")} placeholder="male / female / non_binary" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-blood-group">Blood group</Label>
        <Input id="patient-blood-group" {...form.register("bloodGroup")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-emergency">Emergency contact</Label>
        <Input id="patient-emergency" {...form.register("emergencyContact")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="patient-allergies">Allergies</Label>
        <Textarea id="patient-allergies" {...form.register("allergies")} placeholder="Comma separated list" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
