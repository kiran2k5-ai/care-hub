"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadMedicalReportAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const documentTypes = ["Medical Report", "Prescription", "Lab Report"] as const;

export function ReportUploadForm({ patientId, doctorId, appointmentId }: { patientId: string; doctorId?: string; appointmentId?: string }) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<(typeof documentTypes)[number]>("Medical Report");
  const canSubmit = useMemo(() => title.trim().length >= 3 && file !== null, [title, file]);

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await uploadMedicalReportAction(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Report uploaded");
      setFile(null);
      setTitle("");
    });
  };

  return (
    <form action={submit} className="space-y-4">
      <input type="hidden" name="patientId" value={patientId} />
      {doctorId ? <input type="hidden" name="doctorId" value={doctorId} /> : null}
      {appointmentId ? <input type="hidden" name="appointmentId" value={appointmentId} /> : null}
      <div className="space-y-2">
        <Label htmlFor="report-type">Document type</Label>
        <select id="report-type" name="documentType" value={documentType} onChange={(event) => setDocumentType(event.target.value as (typeof documentTypes)[number])} className="flex h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300">
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="report-title">Title</Label>
        <Input id="report-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ECG Summary" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="report-file">File</Label>
        <Input id="report-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <p className="text-xs text-slate-500">Accepted: PDF, PNG, JPG, WEBP. Max 10 MB.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="report-notes">Notes</Label>
        <Textarea id="report-notes" name="notes" placeholder="Optional summary or reading notes" />
      </div>
      <Button className="w-full" type="submit" disabled={!canSubmit || isPending}>
        {isPending ? "Uploading..." : "Upload document"}
      </Button>
    </form>
  );
}
