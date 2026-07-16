import { getAppointments } from "@/lib/queries";
import { getCurrentUserId } from "@/lib/current-user";
import { DoctorPatientsDirectory } from "./doctor-patients-directory";

export default async function DoctorPatientsPage() {
  const doctorId = await getCurrentUserId();
  const appointments = doctorId ? await getAppointments("doctor", doctorId) : [];
  const patientRows = Array.from(
    new Map(
      appointments.map((appointment) => [
        appointment.patientId,
        {
          id: appointment.patientId,
          name: appointment.patientName,
          lastVisit: appointment.scheduledAt,
          visitCount: appointments.filter((entry) => entry.patientId === appointment.patientId).length,
        },
      ]),
    ).values(),
  );

  return <DoctorPatientsDirectory patients={patientRows} />;
}
