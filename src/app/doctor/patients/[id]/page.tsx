import { getAppointments, getReports } from "@/lib/queries";
import { getCurrentUserId } from "@/lib/current-user";
import { PatientRecordClient } from "./patient-record-client";

export default async function DoctorPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctorId = await getCurrentUserId();
  
  let patientAppointments: any[] = [];
  let patientReports: any[] = [];

  try {
    patientAppointments = doctorId 
      ? (await getAppointments("doctor", doctorId)).filter((appointment) => appointment.patientId === id) 
      : [];
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
  }

  try {
    patientReports = doctorId ? await getReports(id, { patientId: id, doctorId }) : [];
  } catch (err) {
    console.error("Failed to fetch reports:", err);
  }
    
  const hasDoctorAccess = patientAppointments.some((appointment) => ["accepted", "completed"].includes(appointment.status));

  return (
    <PatientRecordClient
      patientId={id}
      doctorId={doctorId ?? ""}
      hasDoctorAccess={hasDoctorAccess}
      appointments={patientAppointments}
      reports={patientReports}
    />
  );
}
