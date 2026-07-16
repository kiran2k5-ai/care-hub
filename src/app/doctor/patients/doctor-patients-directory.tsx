"use client";

import { useMemo, useState } from "react";
import { 
  Search, 
  Eye, 
  FlaskConical, 
  Activity, 
  FileSpreadsheet, 
  FileText,
  UserRound,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

interface PatientRow {
  id: string;
  name: string;
  lastVisit: string;
  visitCount: number;
}

export function DoctorPatientsDirectory({ patients = [] }: { patients: PatientRow[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => 
      !searchQuery || 
      (pat.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [patients, searchQuery]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      {/* CareHub Logo Header */}
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1 space-y-10">
        
        {/* Title and Search row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Patient Medical Records</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Review clinical consult history, medical reports, or upload new files.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name..."
              className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs text-slate-750 focus:outline-none focus:border-slate-350 shadow-xs"
            />
          </div>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Lab Results */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Lab Results</h4>
              <p className="text-slate-400 text-xs mt-1">Urinalysis, Panels</p>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-teal-55/60 text-[#0b665c] flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Prescriptions</h4>
              <p className="text-slate-400 text-xs mt-1">Dosing, Medications</p>
            </div>
          </div>

          {/* Imaging */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Imaging</h4>
              <p className="text-slate-400 text-xs mt-1">X-Rays, Scans</p>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0b335c] text-sm">Clinical Notes</h4>
              <p className="text-slate-400 text-xs mt-1">Visit History Summaries</p>
            </div>
          </div>
        </div>

        {/* Patient archive lists */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif font-bold text-xl text-[#0b335c]">Patient Records Directory</h3>
          </div>

          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.slice(0, visibleCount).map((pat) => (
                <div 
                  key={pat.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex gap-4">
                    {/* Circle avatar */}
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-[#0b335c] shrink-0">
                      {pat.name.charAt(0)}
                    </div>

                    {/* details */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base">{pat.name}</h4>
                      <p className="text-slate-400 text-xs font-semibold">
                        {pat.visitCount} visits • Last visit {new Date(pat.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Action Link view records */}
                  <div className="flex items-center text-xs font-bold text-[#0b335c] pt-2 sm:pt-0 shrink-0">
                    <Link 
                      href={`/doctor/patients/${pat.id}`}
                      className="hover:underline flex items-center gap-1 cursor-pointer bg-slate-50 border border-slate-150 px-4 py-2.5 rounded-xl transition-all"
                    >
                      <Eye className="h-4 w-4 text-slate-500" />
                      <span>View Patient Records</span>
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <UserRound className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-bold text-[#0b335c]">No patients found</p>
              <p className="text-slate-400 text-xs">Verify your search query or check back when a new booking is scheduled.</p>
            </div>
          )}

          {/* Load More Trigger */}
          {filteredPatients.length > visibleCount && (
            <div className="text-center pt-4">
              <button 
                onClick={loadMore}
                className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-8 py-3.5 rounded-full transition-colors shadow-xs"
              >
                Load More Patients
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
              Providing world-class clinician workspace management with high reliability and secure systems.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Staff Policies</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">HIPAA Compliance</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Cookie Preferences</Link></li>
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
            <h4 className="font-semibold text-slate-800 font-serif text-sm flex items-center gap-1">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
              <span>HIPAA Secure</span>
            </h4>
            <p className="leading-relaxed text-emerald-600 font-bold uppercase tracking-widest">
              256-bit AES Encryption
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
