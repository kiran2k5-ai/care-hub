import { getDoctorById } from "@/lib/queries";
import { DoctorProfileClient } from "./doctor-profile-client";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);

  if (!doctor) {
    return (
      <AppShell role="patient" title="Doctor not found" subtitle="This doctor profile is not available in Supabase yet.">
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">No live doctor record was found for this profile id.</CardContent>
        </Card>
      </AppShell>
    );
  }

  return <DoctorProfileClient doctor={doctor} />;
}
