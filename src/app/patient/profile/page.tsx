import { getCurrentUserId } from "@/lib/current-user";
import { getPatientProfile } from "@/lib/queries";
import { PatientProfileClient } from "./patient-profile-client";

export default async function PatientProfilePage() {
  const userId = await getCurrentUserId();
  const profile = userId ? await getPatientProfile(userId) : null;

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm text-center shadow-sm">
          <p className="font-bold text-[#0b335c] text-sm">Access Denied</p>
          <p className="text-slate-500 text-xs mt-2">Sign in to load your patient profile details from Supabase.</p>
        </div>
      </main>
    );
  }

  return <PatientProfileClient profile={profile ?? undefined} />;
}
