"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  FileText, 
  FlaskConical, 
  Activity, 
  FileSpreadsheet, 
  FileHeart,
  Calendar,
  UserRound,
  ShieldCheck,
  Video,
  Clock,
  Plus,
  UploadCloud,
  FileDown
} from "lucide-react";
import Link from "next/link";
import { uploadMedicalReportAction, deleteMedicalReportAction } from "@/app/actions";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientId: string;
  patientName: string;
  status: "pending" | "accepted" | "declined" | "waiting" | "cancelled" | "completed";
  scheduledAt: string;
  reason: string;
}

interface MedicalReport {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string | null;
  doctorName: string | null;
  title: string;
  notes: string | null;
  fileUrl: string;
  fileName: string;
  documentType: string;
  createdAt: string;
}

interface PatientRecordClientProps {
  patientId: string;
  doctorId: string;
  hasDoctorAccess: boolean;
  appointments: Appointment[];
  reports: MedicalReport[];
}

const documentTypes = ["Medical Report", "Prescription", "Lab Report"] as const;

export function PatientRecordClient({ 
  patientId, 
  doctorId, 
  hasDoctorAccess, 
  appointments = [], 
  reports: initialReports = [] 
}: PatientRecordClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<(typeof documentTypes)[number]>("Medical Report");
  const [notes, setNotes] = useState("");

  const canSubmit = useMemo(() => title.trim().length >= 3 && file !== null, [title, file]);

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (!file) return;

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("doctorId", doctorId);
    formData.append("title", title);
    formData.append("documentType", documentType);
    formData.append("notes", notes);
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadMedicalReportAction(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Document uploaded successfully");
      setFile(null);
      setTitle("");
      setNotes("");
      router.refresh();
    });
  };

  const handleDeleteReport = (reportId: string) => {
    startTransition(async () => {
      const result = await deleteMedicalReportAction({ reportId });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Document deleted successfully");
      router.refresh();
    });
  };

  // Helper to determine icon based on document type
  const getFileIcon = (docType: string) => {
    const type = docType.toLowerCase();
    if (type.includes("lab") || type.includes("blood")) {
      return <FlaskConical className="h-6 w-6 text-[#0b665c]" />;
    }
    if (type.includes("prescription")) {
      return <FileHeart className="h-6 w-6 text-rose-500" />;
    }
    if (type.includes("imaging") || type.includes("x-ray") || type.includes("scan")) {
      return <Activity className="h-6 w-6 text-sky-500" />;
    }
    return <FileText className="h-6 w-6 text-slate-500" />;
  };

  const patientName = appointments[0]?.patientName || "Patient";

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      
      {/* CareHub Header Navbar */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/doctor/dashboard" className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">
            CareHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/doctor/dashboard" 
            className="border border-slate-200 hover:bg-slate-50 text-[#0b335c] text-xs font-semibold px-4.5 py-2 rounded-full transition-colors shadow-sm"
          >
            Dashboard
          </Link>
          <Link 
            href="/login" 
            className="bg-[#0b335c] hover:bg-[#061e38] text-white text-xs font-semibold px-4.5 py-2 rounded-full transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8-cols width): Appointment Timeline & Documents List */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title Block */}
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Patient Clinical Record</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Currently viewing files and appointments timeline for: <strong className="text-slate-800 font-bold">{patientName}</strong>
              </p>
            </div>

            {/* Appointment Timeline Section */}
            <section className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider">Appointment History</h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {appointments.length} Consultations
                </span>
              </div>

              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((app) => (
                    <div 
                      key={app.id} 
                      className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{app.doctorName}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{app.specialty}</span>
                        </div>
                        <p className="text-xs text-slate-600 italic">"{app.reason || "General Consultation Checkup"}"</p>
                        
                        <div className="flex gap-4 text-[10px] text-slate-400 font-medium pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span suppressHydrationWarning>{new Date(app.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span suppressHydrationWarning>{new Date(app.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-450 text-xs italic py-4">No appointment history listed for this patient.</p>
              )}
            </section>

            {/* Medical Documents List */}
            <section className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-[#0b335c]">Shared Diagnostics & Medical Documents</h3>
              </div>

              {initialReports.length > 0 ? (
                <div className="space-y-4">
                  {initialReports.map((rep) => {
                    const Icon = getFileIcon(rep.documentType);
                    return (
                      <div 
                        key={rep.id} 
                        className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            {Icon}
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-sm sm:text-base">{rep.title}</h4>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 font-medium">
                              <span suppressHydrationWarning>{new Date(rep.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              <span>•</span>
                              <span>{rep.fileName}</span>
                              <span>•</span>
                              <span className="uppercase text-[9px] tracking-wider text-slate-450 px-2 py-0.5 bg-slate-50 border border-slate-150 rounded-full">
                                {rep.documentType}
                              </span>
                            </div>
                            {rep.notes && (
                              <p className="text-slate-500 text-xs italic leading-relaxed pt-1">"{rep.notes}"</p>
                            )}
                          </div>
                        </div>

                        {/* View / Download / Delete actions */}
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-550 shrink-0">
                          <a 
                            href={rep.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hover:text-[#0b335c] flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </a>
                          <button 
                            suppressHydrationWarning
                            onClick={() => handleDeleteReport(rep.id)}
                            className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
                  <FileText className="h-10 w-10 text-slate-350 mx-auto" />
                  <p className="font-bold text-[#0b335c]">No shared files yet</p>
                  <p className="text-slate-400 text-xs">Diagnostic reports or clinical summaries uploaded for this patient will list here.</p>
                </div>
              )}
            </section>

          </div>

          {/* Right Column (4-cols width): Document Upload form */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Upload form card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0b335c]">Upload Clinical Document</h3>
              </div>

              {hasDoctorAccess ? (
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {/* Select Doc Type */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Document Type</label>
                    <select 
                      suppressHydrationWarning
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value as (typeof documentTypes)[number])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 focus:outline-none focus:border-slate-300"
                    >
                      {documentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Document Title input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Document Title</label>
                    <input 
                      suppressHydrationWarning
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. ECG Results Panel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300"
                    />
                  </div>

                  {/* Notes Textarea */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Notes / Summary</label>
                    <textarea 
                      suppressHydrationWarning
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional notes or readings description..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 resize-none"
                    />
                  </div>

                  {/* File Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Diagnostics File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50/50 cursor-pointer relative">
                      <input 
                        suppressHydrationWarning
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="text-[11px] font-bold text-[#0b335c] mt-1.5">
                        {file ? file.name : "Choose File or Drag & Drop"}
                      </p>
                      <span className="text-[9px] text-slate-450 mt-1 block">Accepted: PDF, PNG, JPG, WEBP. Max 10MB</span>
                    </div>
                  </div>

                  {/* Upload Submit Trigger */}
                  <div className="pt-2">
                    <button
                      suppressHydrationWarning
                      type="submit"
                      disabled={!canSubmit || isPending}
                      className="w-full bg-[#0b665c] hover:bg-[#084e46] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs"
                    >
                      {isPending ? "Uploading document..." : "Upload Document"}
                    </button>
                  </div>

                </form>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <p className="text-xs text-rose-700 leading-relaxed font-semibold">
                    Upload access is restricted. Doctors can only upload documents after an accepted or completed consultation with this patient.
                  </p>
                </div>
              )}

            </div>

            {/* Quick tips brief */}
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 space-y-4">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Security Standards</span>
              </span>
              <p className="text-slate-500 text-xs leading-relaxed">
                All clinical uploads are secured using HIPAA-compliant 256-bit AES encryption schemas. Ensure correct file values are entered before submitting.
              </p>
            </div>

          </aside>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 w-full mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
            <p className="leading-relaxed">
              Providing world-class clinician workspace management with high reliability and secure systems.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Staff Policies</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Staff Help Desk</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Clinical Operations</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 font-serif text-sm">Portals Workspace</h4>
            <p className="leading-relaxed text-emerald-600 font-bold uppercase tracking-widest">
              HIPAA Secure 256-bit AES
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-100 mt-8 pt-6 text-center text-[10px] text-slate-400">
          <p>&copy; 2024 CareHub Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
