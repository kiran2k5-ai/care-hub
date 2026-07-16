import { getCurrentUserId } from "@/lib/current-user";
import { getReports } from "@/lib/queries";
import { MedicalRecordsDirectory } from "./medical-records-directory";

export default async function PatientRecordsPage() {
  const patientId = await getCurrentUserId();
  const reports = patientId ? await getReports(patientId) : [];

  return <MedicalRecordsDirectory reports={reports} />;
}
