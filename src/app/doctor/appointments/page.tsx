import { getAppointments } from "@/lib/queries";
import { RealtimeRefresh } from "@/components/live/realtime-refresh";
import { getCurrentUserId } from "@/lib/current-user";
import { DoctorAppointmentsClient } from "./doctor-appointments-client";

export default async function DoctorAppointmentsPage() {
  const doctorId = await getCurrentUserId();
  const appointments = doctorId ? await getAppointments("doctor", doctorId) : [];

  return (
    <>
      <RealtimeRefresh />
      <DoctorAppointmentsClient appointments={appointments} />
    </>
  );
}
