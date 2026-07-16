"use client";

import { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  User, 
  Phone, 
  Calendar, 
  Droplet, 
  ShieldAlert, 
  HeartHandshake, 
  Save, 
  ShieldCheck, 
  Info,
  Layers
} from "lucide-react";
import Link from "next/link";
import { savePatientProfileAction } from "@/app/actions";
import { patientProfileSchema, type PatientProfileInput } from "@/lib/validators";

export function PatientProfileClient({ 
  profile 
}: { 
  profile?: Partial<PatientProfileInput>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PatientProfileInput>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      fullName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      dateOfBirth: profile?.dateOfBirth ?? "",
      gender: profile?.gender,
      bloodGroup: profile?.bloodGroup ?? "",
      allergies: profile?.allergies ?? "",
      emergencyContact: profile?.emergencyContact ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      dateOfBirth: profile?.dateOfBirth ?? "",
      gender: profile?.gender,
      bloodGroup: profile?.bloodGroup ?? "",
      allergies: profile?.allergies ?? "",
      emergencyContact: profile?.emergencyContact ?? "",
    });
  }, [profile, form]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await savePatientProfileAction(values);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated successfully");
      router.refresh();
    });
  });

  const selectedBlood = form.watch("bloodGroup") || "Not specified";
  const selectedAllergies = form.watch("allergies") || "None listed";

  return (
    <main className="min-h-screen bg-slate-50/50 font-sans flex flex-col justify-between">
      
      {/* CareHub Logo Header */}
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

      {/* Main Body Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8-cols width): Form details */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0b335c] tracking-tight">Personal Health Profile</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Complete your demographics and health history records for faster care matching.</p>
            </div>

            <section className="bg-white border border-slate-200/75 rounded-3xl p-6 md:p-8 shadow-sm">
              <form onSubmit={onSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("fullName")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("phone")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="date" 
                        {...form.register("dateOfBirth")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <input 
                      type="text" 
                      placeholder="male / female / non_binary"
                      {...form.register("gender")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
                    <div className="relative">
                      <Droplet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("bloodGroup")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</label>
                    <div className="relative">
                      <HeartHandshake className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
                      <input 
                        type="text" 
                        {...form.register("emergencyContact")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350"
                      />
                    </div>
                  </div>

                </div>

                {/* Allergies - Full Width */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Known Allergies / Medical Conditions</label>
                  <div className="relative">
                    <ShieldAlert className="absolute left-3.5 top-4 h-4 w-4 text-slate-450" />
                    <textarea 
                      {...form.register("allergies")}
                      rows={3}
                      placeholder="e.g. Penicillin, Pollen, Peanuts (Comma separated)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pt-3 pb-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-slate-350 resize-none"
                    />
                  </div>
                </div>

                {/* Submit button block */}
                <div className="pt-4 flex justify-start">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#0b335c] hover:bg-[#061e38] text-white font-bold text-xs px-8 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>{isPending ? "Saving changes..." : "Save Health Profile"}</span>
                  </button>
                </div>

              </form>
            </section>
          </div>

          {/* Right Column (4-cols width): profile card & HIPAA guidelines */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Quick Profile Brief */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-3.5">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-sm text-[#0b335c]">
                  {(profile?.fullName || "P").charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{profile?.fullName || "Patient"}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Member</p>
                </div>
              </div>

              {/* General details, excluding blood sugar/heart rate */}
              <div className="space-y-3 text-xs text-slate-650">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-[#0b335c]">Blood Group</span>
                  <span className="text-slate-500 font-semibold">{selectedBlood}</span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allergies Listed</span>
                  <p className="text-slate-500 italic mt-1 leading-relaxed">
                    "{selectedAllergies}"
                  </p>
                </div>
              </div>
            </div>

            {/* Profile guide */}
            <div className="bg-[#0b335c]/5 border border-[#0b335c]/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-[#009688]" />
                <span>Patient Health Privacy</span>
              </h3>
              <p className="text-slate-550 text-xs leading-relaxed">
                Profile details, date of birth, blood groups, and allergy files are loaded securely for your designated practitioners only when scheduling consultation slots.
              </p>
            </div>

            {/* HIPAA card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-xs">
              <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-[#0b335c] text-sm">HIPAA Protected</h4>
              <p className="text-slate-450 text-[10px] leading-relaxed">
                Your medical files and profiles are protected under HIPAA clinical standards using AES-256 secure encryption methods.
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
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Patient Help Desk</Link></li>
              <li><Link href="#" className="hover:text-[#0b335c] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 font-serif text-sm">Clinical Systems</h4>
            <p className="leading-relaxed text-emerald-600 font-bold uppercase tracking-widest">
              HIPAA Compliant System
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
