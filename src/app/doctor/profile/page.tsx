import { getCurrentUserId } from "@/lib/current-user";
import { getDoctorProfile } from "@/lib/queries";
import { DoctorProfileClient } from "./doctor-profile-client";

export default async function DoctorProfilePage() {
  const doctorId = await getCurrentUserId();
  const profile = doctorId ? await getDoctorProfile(doctorId) : null;

  if (!doctorId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm text-center shadow-sm">
          <p className="font-bold text-[#0b335c] text-sm">Access Denied</p>
          <p className="text-slate-500 text-xs mt-2">Sign in to load your doctor profile details from Supabase.</p>
        </div>
      </main>
    );
  }

  return <DoctorProfileClient doctorId={doctorId} profile={profile ?? undefined} />;
}
