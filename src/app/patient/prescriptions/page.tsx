import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getCurrentUserId } from "@/lib/current-user";
import { getReports } from "@/lib/queries";
import { Search, Eye, Download } from "lucide-react";
import Link from "next/link";

export default async function PatientPrescriptionsPage() {
  const patientId = await getCurrentUserId();
  const allReports = patientId ? await getReports(patientId) : [];
  const prescriptions = allReports.filter((report) => report.documentType === "Prescription");

  return (
    <AppShell role="patient" title="Prescriptions" subtitle="Review active prescriptions, dosages, and clinical details shared by your medical practitioners.">
      <div className="space-y-5 rounded-none border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Prescriptions list</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Search your prescription records</h2>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search prescriptions..."
              className="w-full rounded-none border border-slate-200 bg-slate-50 px-11 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Active Prescriptions", value: prescriptions.length },
            { label: "Prescribing Clinicians", value: new Set(prescriptions.map(p => p.doctorName)).size },
          ].map((stat) => (
            <div key={stat.label} className="rounded-none border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {prescriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-semibold">Prescription Title</th>
                    <th className="pb-3 font-semibold">Clinician</th>
                    <th className="pb-3 font-semibold">Issued Date</th>
                    <th className="pb-3 font-semibold">Dosage Notes</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {prescriptions.map((pres) => (
                    <tr key={pres.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{pres.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">File: {pres.fileName}</p>
                      </td>
                      <td className="py-4">
                        <p className="font-semibold text-slate-700">{pres.doctorName || "System Upload"}</p>
                      </td>
                      <td className="py-4 text-slate-500 font-medium">
                        {new Date(pres.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-4 text-slate-600 max-w-xs truncate">
                        {pres.notes || "No special instructions recorded."}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a 
                            href={pres.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-none border border-slate-100 bg-white text-slate-400 hover:text-sky-600 hover:border-sky-100 shadow-sm transition-colors"
                            title="View Prescription"
                            aria-label="View Prescription file"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <a 
                            href={pres.fileUrl} 
                            download 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-none border border-slate-100 bg-white text-slate-400 hover:text-sky-600 hover:border-sky-100 shadow-sm transition-colors"
                            title="Download File"
                            aria-label="Download Prescription file"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              title="No prescriptions yet" 
              description="Any medical prescriptions uploaded by your doctor will show up here." 
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
