"use client";

import { useState } from "react";
import { Search, MapPin, Star, UserRound, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface DoctorSummary {
  id: string;
  fullName: string;
  specialty: string;
  consultationFee: number;
  experienceYears: number;
  clinicAddress: string;
  rating: number;
  nextAvailable: string;
  bio: string;
}

export function DashboardSearch({ doctors }: { doctors: DoctorSummary[] }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    const results = doctors.filter((doc) => {
      const matchesQuery = 
        !query || 
        doc.fullName.toLowerCase().includes(query.toLowerCase()) || 
        doc.specialty.toLowerCase().includes(query.toLowerCase()) || 
        doc.bio.toLowerCase().includes(query.toLowerCase());
        
      const matchesLocation = 
        !location || 
        doc.clinicAddress.toLowerCase().includes(location.toLowerCase());

      return matchesQuery && matchesLocation;
    });

    setFilteredDoctors(results);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2.5">
        <h3 className="font-serif font-bold text-3xl text-[#0b335c]">Find Your First Doctor</h3>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Search over 5,000+ top-rated specialists in our network.
        </p>
      </div>

      {/* Search Bar Input Container */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl md:rounded-full border border-slate-200/80 shadow-md p-1.5 flex flex-col md:flex-row items-center max-w-3xl mx-auto w-full gap-2 md:gap-0">
        <div className="flex-1 flex items-center w-full px-4 gap-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, specialty, or condition..."
            className="w-full bg-transparent focus:outline-none text-slate-700 text-sm placeholder-slate-400 py-2.5"
          />
        </div>
        <div className="hidden md:block h-8 w-[1.5px] bg-slate-200 shrink-0" />
        <div className="flex-[0.8] flex items-center w-full px-4 gap-3 border-t border-slate-100 md:border-t-0 py-2 md:py-0">
          <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent focus:outline-none text-slate-700 text-sm placeholder-slate-400 py-2.5"
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-[#0b335c] hover:bg-[#061e38] text-white font-semibold text-sm px-7 py-3 rounded-xl md:rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap"
        >
          Search Doctors
        </button>
      </form>

      {/* Search Results Display inline */}
      {hasSearched && (
        <div className="mt-8 space-y-4 max-w-5xl mx-auto">
          <h4 className="text-lg font-bold text-[#0b335c] border-b border-slate-100 pb-2">
            Search Results ({filteredDoctors.length})
          </h4>
          
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/patient/doctors/${doc.id}`}
                  className="bg-white border border-slate-200 hover:border-slate-350 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group animate-fade-up"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#3bf0df]/20 text-[#0b335c] flex items-center justify-center shrink-0">
                        <UserRound className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span>{doc.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-base text-[#0b335c] group-hover:text-[#0b7a75] transition-colors">
                        {doc.fullName}
                      </h5>
                      <span className="inline-block bg-slate-50 text-slate-600 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase mt-1">
                        {doc.specialty}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 mt-4 pt-3.5 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-600">${doc.consultationFee}</span>
                      <span> / consult</span>
                    </div>
                    <span className="text-[#0b7a75] font-bold group-hover:underline flex items-center gap-1">
                      <span>View Profile</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-bold text-[#0b335c]">No doctors found</p>
              <p className="text-slate-400 text-xs">Try adjusting your search terms or location query.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
