"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MedicalReport } from "@/lib/types";
import { deleteMedicalReportAction } from "@/app/actions";

export function ReportList({ reports, canManage = false }: { reports: MedicalReport[]; canManage?: boolean }) {
  const [isPending, startTransition] = useTransition();

  const deleteReport = (reportId: string) => {
    startTransition(async () => {
      const result = await deleteMedicalReportAction({ reportId });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Document removed");
    });
  };

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-950">{report.title}</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{report.documentType}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {report.fileName} • {new Date(report.createdAt).toLocaleDateString()}
              </p>
              {report.notes ? <p className="mt-2 text-sm text-slate-600">{report.notes}</p> : null}
              {report.doctorName ? <p className="mt-2 text-xs text-slate-500">Uploaded by {report.doctorName}</p> : null}
            </div>
            <div className="flex gap-2">
              <a href={report.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
                View
              </a>
              {canManage ? (
                <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={() => deleteReport(report.id)}>
                  Delete
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
