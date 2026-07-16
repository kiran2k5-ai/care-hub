"use client";

import { useMemo, useState } from "react";
import { 
  Search, 
  Eye, 
  Download, 
  Share2, 
  FileText, 
  FlaskConical, 
  Activity, 
  FileSpreadsheet, 
  FileHeart,
  Grid,
  List,
  ShieldCheck,
  ChevronDown,
  Calendar,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

export function MedicalRecordsDirectory({ reports }: { reports: MedicalReport[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const matchesSearch = 
        !searchQuery ||
        (rep.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rep.doctorName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rep.documentType || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        !selectedCategory ||
        (selectedCategory === "lab" && (rep.documentType || "").toLowerCase().includes("lab")) ||
        (selectedCategory === "prescription" && (rep.documentType || "").toLowerCase().includes("prescription")) ||
        (selectedCategory === "imaging" && ((rep.documentType || "").toLowerCase().includes("imaging") || (rep.documentType || "").toLowerCase().includes("x-ray") || (rep.documentType || "").toLowerCase().includes("scan"))) ||
        (selectedCategory === "medical-record" && ((rep.documentType || "").toLowerCase().includes("medical report") || (rep.documentType || "").toLowerCase().includes("note") || (rep.documentType || "").toLowerCase().includes("summary")));

      return matchesSearch && matchesCategory;
    });
  }, [reports, searchQuery, selectedCategory]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
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

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      {/* CareHub Header - Clean with logo, Dashboard and Sign Out */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/patient/dashboard" className="font-serif font-bold text-2xl text-[#0b335c] tracking-tight">
            CareHub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/patient/dashboard" 
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
        
        {/* Title and Search row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Medical Records</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Securely access and manage your clinical documents.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records, providers, or dates..."
              className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs text-slate-750 focus:outline-none focus:border-slate-350 shadow-xs"
            />
          </div>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Lab Results */}
          <button 
            onClick={() => setSelectedCategory(selectedCategory === "lab" ? null : "lab")}
            className={`bg-white border rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center ${
              selectedCategory === "lab" ? "border-emerald-500 ring-2 ring-emerald-50" : "border-slate-200/60"
            }`}
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Lab Results</h4>
              <p className="text-slate-400 text-xs mt-1">Bloodwork, Urinalysis</p>
            </div>
          </button>

          {/* Prescriptions */}
          <button 
            onClick={() => setSelectedCategory(selectedCategory === "prescription" ? null : "prescription")}
            className={`bg-white border rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center ${
              selectedCategory === "prescription" ? "border-emerald-500 ring-2 ring-emerald-50" : "border-slate-200/60"
            }`}
          >
            <div className="h-12 w-12 rounded-2xl bg-teal-55/60 text-[#0b665c] flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Prescriptions</h4>
              <p className="text-slate-400 text-xs mt-1">Active, Past Medications</p>
            </div>
          </button>

          {/* Imaging */}
          <button 
            onClick={() => setSelectedCategory(selectedCategory === "imaging" ? null : "imaging")}
            className={`bg-white border rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center ${
              selectedCategory === "imaging" ? "border-emerald-500 ring-2 ring-emerald-50" : "border-slate-200/60"
            }`}
          >
            <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Imaging</h4>
              <p className="text-slate-400 text-xs mt-1">X-Rays, MRI, CT Scans</p>
            </div>
          </button>

          {/* Medical Record */}
          <button 
            onClick={() => setSelectedCategory(selectedCategory === "medical-record" ? null : "medical-record")}
            className={`bg-white border rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center ${
              selectedCategory === "medical-record" ? "border-emerald-500 ring-2 ring-emerald-50" : "border-slate-200/60"
            }`}
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Medical Record</h4>
              <p className="text-slate-400 text-xs mt-1">Visit History, General Reports</p>
            </div>
          </button>
        </div>

        {/* Recent Records list header */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif font-bold text-xl text-[#0b335c]">Recent Records</h3>
            
            {/* List/Grid toggles */}
            <div className="bg-slate-100 border border-slate-200/50 p-1 flex items-center rounded-xl">
              <button 
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-white text-[#0b335c] shadow-xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>List</span>
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#0b335c] shadow-xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Records Layout Grid/List */}
          {filteredReports.length > 0 ? (
            <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
              {filteredReports.slice(0, visibleCount).map((rep) => {
                const Icon = getFileIcon(rep.documentType);
                return (
                  <div 
                    key={rep.id}
                    className={`bg-white border border-slate-200/80 rounded-3xl p-5 hover:shadow-md transition-all duration-200 flex ${
                      viewMode === "list" 
                        ? "flex-col sm:flex-row justify-between items-start sm:items-center gap-4" 
                        : "flex-col justify-between gap-6"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Document Type Icon */}
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {Icon}
                      </div>

                      {/* Info details */}
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">{rep.title}</h4>
                        
                        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-350" />
                            <span>{new Date(rep.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </span>
                          {rep.doctorName && (
                            <span className="flex items-center gap-1">
                              <UserRound className="h-3.5 w-3.5 text-slate-350" />
                              <span>{rep.doctorName}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                            {rep.documentType}
                          </span>
                        </div>

                        {rep.notes && (
                          <p className="text-slate-500 text-xs leading-relaxed italic pt-1">"{rep.notes}"</p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons (View / Download / Share) */}
                    <div className="flex items-center gap-4.5 text-xs font-bold text-slate-550 border-t border-slate-50 sm:border-t-0 pt-3.5 sm:pt-0 w-full sm:w-auto shrink-0 justify-end">
                      <a 
                        href={rep.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-[#0b335c] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 text-slate-450" />
                        <span>View</span>
                      </a>
                      <a 
                        href={rep.fileUrl} 
                        download
                        className="hover:text-[#0b335c] flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-slate-450" />
                        <span>Download</span>
                      </a>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(rep.fileUrl);
                          toast.success("Document link copied to clipboard");
                        }}
                        className="hover:text-[#0b335c] flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="h-4 w-4 text-slate-450" />
                        <span>Share</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <FileText className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-bold text-[#0b335c]">No documents found</p>
              <p className="text-slate-400 text-xs">Verify your search term or try resetting selected category.</p>
            </div>
          )}

          {/* Load More Button */}
          {filteredReports.length > visibleCount && (
            <div className="text-center pt-4">
              <button 
                onClick={loadMore}
                className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-8 py-3.5 rounded-full transition-colors shadow-xs"
              >
                Load More Records
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 w-full mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
            <p className="leading-relaxed">
              Providing world-class healthcare management solutions with precision and security at your fingertips.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Cookie Preferences</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Help Center</Link></li>
              <li><Link href="/patient/doctors" className="hover:text-[#0b335c] transition-colors">Find a Doctor</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 font-serif text-sm flex items-center gap-1">
              <ShieldCheck className="h-4.5 w-4.5 text-[#009688]" />
              <span>Security</span>
            </h4>
            <p className="leading-relaxed flex items-center gap-1.5 text-[#009688] font-bold">
              <span>256-bit AES Encrypted</span>
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
