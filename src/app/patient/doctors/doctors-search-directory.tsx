"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  ChevronDown, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle
} from "lucide-react";

interface Doctor {
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

export function DoctorsSearchDirectory({ doctors }: { doctors: Doctor[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("recommended");

  // Handle specialty toggle
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Filter logic
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Query search
        const matchesQuery = 
          !searchQuery ||
          doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.clinicAddress.toLowerCase().includes(searchQuery.toLowerCase());

        // Specialty filters
        const matchesSpecialty = 
          selectedSpecialties.length === 0 ||
          selectedSpecialties.some(spec => 
            doc.specialty.toLowerCase().includes(spec.toLowerCase())
          );

        // Rating filters
        const matchesRating = 
          selectedRating === null ||
          doc.rating >= selectedRating;

        // Availability filter (e.g. today or upcoming next 3 days)
        const matchesAvailability = 
          !selectedAvailability ||
          (selectedAvailability === "today" && doc.nextAvailable.toLowerCase().includes("today")) ||
          (selectedAvailability === "upcoming" && (doc.nextAvailable.toLowerCase().includes("today") || doc.nextAvailable.toLowerCase().includes("tomorrow") || doc.nextAvailable.toLowerCase().includes("oct") || doc.nextAvailable.toLowerCase().includes("nov")));

        return matchesQuery && matchesSpecialty && matchesRating && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortOption === "rating") {
          return b.rating - a.rating;
        }
        if (sortOption === "fee") {
          return a.consultationFee - b.consultationFee;
        }
        return 0; // default Recommended order
      });
  }, [doctors, searchQuery, selectedSpecialties, selectedRating, selectedAvailability, sortOption]);

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      {/* Navigation Header - Nav links removed, only Dashboard and Sign Out shown */}
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

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </h3>
              <button 
                onClick={() => {
                  setSelectedSpecialties([]);
                  setSelectedRating(null);
                  setSelectedAvailability(null);
                }}
                className="text-[10px] font-bold text-[#0b335c] hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Specialty Checkboxes */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty</span>
              <div className="space-y-2">
                {["Cardiology", "Neurology", "Dermatology", "Pediatrics"].map((spec) => (
                  <label key={spec} className="flex items-center gap-2.5 text-slate-600 text-xs cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedSpecialties.includes(spec)}
                      onChange={() => toggleSpecialty(spec)}
                      className="rounded border-slate-300 text-[#0b335c] focus:ring-[#0b335c]"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Radio list */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-slate-600 text-xs cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="rating"
                    checked={selectedRating === 4}
                    onChange={() => setSelectedRating(4)}
                    className="border-slate-300 text-[#0b335c] focus:ring-[#0b335c]"
                  />
                  <span className="flex items-center gap-1">
                    <span>4.0 & above</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                </label>
                <label className="flex items-center gap-2.5 text-slate-600 text-xs cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="rating"
                    checked={selectedRating === 3}
                    onChange={() => setSelectedRating(3)}
                    className="border-slate-300 text-[#0b335c] focus:ring-[#0b335c]"
                  />
                  <span className="flex items-center gap-1">
                    <span>3.0 & above</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                </label>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Availability</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-slate-600 text-xs cursor-pointer select-none">
                  <input 
                    type="radio"
                    name="availability"
                    checked={selectedAvailability === "today"}
                    onChange={() => setSelectedAvailability("today")}
                    className="border-slate-300 text-[#0b335c] focus:ring-[#0b335c]"
                  />
                  <span>Today</span>
                </label>
                <label className="flex items-center gap-2.5 text-slate-600 text-xs cursor-pointer select-none">
                  <input 
                    type="radio"
                    name="availability"
                    checked={selectedAvailability === "upcoming"}
                    onChange={() => setSelectedAvailability("upcoming")}
                    className="border-slate-300 text-[#0b335c] focus:ring-[#0b335c]"
                  />
                  <span>Next 3 Days</span>
                </label>
              </div>
            </div>

          </aside>

          {/* Right Column: Specialists Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/50 rounded-2xl p-5 shadow-xs">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#0b335c]">Found {filteredDoctors.length} Specialists</h2>
                <p className="text-slate-400 text-xs font-medium">Top-rated cardiologists and specialists available in your area</p>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-slate-300"
                >
                  <option value="recommended">Most Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="fee">Lowest Consultation Fee</option>
                </select>
              </div>
            </div>

            {/* Grid of Doctor Cards */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doc) => (
                  <div 
                    key={doc.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="space-y-4">
                      {/* Photo & Rating header */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="h-16 w-16 relative rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                          <Image
                            src={doc.fullName.includes("Alaric") ? "/alaric_thorne.png" : "/explore_services.png"}
                            alt={doc.fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{doc.rating?.toFixed(1) ?? "4.8"}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="font-bold text-base text-[#0b335c]">{doc.fullName}</h4>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">{doc.specialty}</p>
                      </div>

                      {/* Next availability & Location metadata */}
                      <div className="space-y-2 border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="font-medium">Next: <span className="text-slate-800 font-bold">{doc.nextAvailable || "Monday, 10:00 AM"}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.clinicAddress || "Central Medical Center"}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Profile Action */}
                    <div className="mt-5">
                      <Link 
                        href={`/patient/doctors/${doc.id}`}
                        className="block w-full text-center border border-[#0b335c] text-[#0b335c] hover:bg-[#0b335c]/5 font-bold text-xs py-2.5 rounded-xl transition-all"
                      >
                        View Profile
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-bold text-[#0b335c]">No doctors match your filters</p>
                <p className="text-slate-400 text-xs">Try selecting a different specialty or clearing rating constraints.</p>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-4">
              <button className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-full bg-[#0b665c] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </button>
              <button className="h-8 w-8 rounded-full border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">
                2
              </button>
              <button className="h-8 w-8 rounded-full border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">
                3
              </button>
              <span className="text-slate-400 text-xs font-bold px-1">...</span>
              <button className="h-8 w-8 rounded-full border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">
                12
              </button>
              <button className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#0b335c]">CareHub</h4>
            <p className="leading-relaxed">
              Premium healthcare solutions for modern patients. Quality care, just a click away.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/patient/doctors" className="hover:text-[#0b335c] transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/patient/services" className="hover:text-[#0b335c] transition-colors">Medical Services</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Patient Resources</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Help Center</Link></li>
              <li><Link href="/patient/doctors" className="hover:text-[#0b335c] transition-colors">Find a Doctor</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-100 mt-8 pt-6 text-center text-[10px] text-slate-400">
          <p>&copy; 2024 CareHub Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
