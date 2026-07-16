import { getDoctors } from "@/lib/queries";
import { DoctorsSearchDirectory } from "./doctors-search-directory";

export default async function PatientDoctorsPage() {
  const doctors = await getDoctors();

  return <DoctorsSearchDirectory doctors={doctors} />;
}
