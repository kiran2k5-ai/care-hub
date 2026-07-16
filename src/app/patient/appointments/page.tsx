import { getAppointments } from "@/lib/queries";
import { RealtimeRefresh } from "@/components/live/realtime-refresh";
import { getCurrentUserId } from "@/lib/current-user";
import { PatientAppointmentsClient } from "./patient-appointments-client";

export default async function PatientAppointmentsPage() {
  const patientId = await getCurrentUserId();
  const appointments = patientId ? await getAppointments("patient", patientId) : [];

  return (
    <>
      <RealtimeRefresh />
      <PatientAppointmentsClient appointments={appointments} />
    </>
  );
}
