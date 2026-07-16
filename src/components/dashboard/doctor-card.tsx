import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DoctorSummary } from "@/lib/types";

export function DoctorCard({ doctor }: { doctor: DoctorSummary }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{doctor.fullName}</h3>
            <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-800">{doctor.rating.toFixed(1)} rating</Badge>
        </div>
        <p className="text-sm leading-6 text-slate-600">{doctor.bio}</p>
        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
          <span>{doctor.experienceYears} years experience</span>
          <span>•</span>
          <span>${doctor.consultationFee} consult</span>
          <span>•</span>
          <span>{doctor.nextAvailable}</span>
        </div>
        <Link href={`/patient/doctors/${doctor.id}`} className="inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900">
          View availability and book
        </Link>
      </CardContent>
    </Card>
  );
}
