import { hasSupabaseEnv, hasSupabaseServiceRole } from "./supabase/config";
import { createSupabaseServerClient } from "./supabase/server";
import { createSupabaseServiceRoleClient } from "./supabase/service-server";

export async function getProfile(userId: string) {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("id, role, full_name, email, phone, avatar_url").eq("id", userId).maybeSingle();

  return data
    ? {
        id: data.id,
        role: data.role,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        avatarUrl: data.avatar_url,
      }
    : null;
}

export async function getPatientProfile(userId: string) {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("patient_profiles")
    .select("id, date_of_birth, gender, blood_group, allergies, emergency_contact")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return null;

  const { data: profileData } = await supabase.from("profiles").select("full_name, phone, email, avatar_url").eq("id", userId).maybeSingle();
  const profile = (profileData ?? {}) as { full_name?: string; phone?: string | null; email?: string; avatar_url?: string | null };

  return {
    id: data.id,
    fullName: profile.full_name ?? "",
    phone: profile.phone ?? undefined,
    email: profile.email ?? "",
    avatarUrl: profile.avatar_url ?? undefined,
    dateOfBirth: data.date_of_birth,
    gender: data.gender,
    bloodGroup: data.blood_group,
    allergies: data.allergies?.join(", ") ?? "",
    emergencyContact: data.emergency_contact ?? undefined,
  };
}

export async function getDoctorProfile(userId: string) {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("doctor_profiles")
    .select("id, specialty, qualifications, experience_years, consultation_fee, clinic_address, bio, available_days, available_hours")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return null;

  const { data: profileData } = await supabase.from("profiles").select("full_name, phone, email, avatar_url").eq("id", userId).maybeSingle();
  const profile = (profileData ?? {}) as { full_name?: string; phone?: string | null; email?: string; avatar_url?: string | null };

  const { data: slotsData } = await supabase
    .from("doctor_availability")
    .select("weekday, start_time, end_time")
    .eq("doctor_id", userId)
    .order("weekday", { ascending: true });

  const weeklySlots = (slotsData ?? []).map((slot) => ({
    weekday: slot.weekday,
    startTime: slot.start_time.substring(0, 5),
    endTime: slot.end_time.substring(0, 5),
  }));

  return {
    id: data.id,
    fullName: profile.full_name ?? "",
    phone: profile.phone ?? undefined,
    email: profile.email ?? "",
    avatarUrl: profile.avatar_url ?? undefined,
    specialty: data.specialty,
    qualifications: data.qualifications,
    experienceYears: data.experience_years,
    consultationFee: Number(data.consultation_fee),
    clinicAddress: data.clinic_address,
    bio: data.bio,
    availableDays: data.available_days ?? [],
    availableHours: data.available_hours,
    weeklySlots,
  };
}

export async function getDoctorById(userId: string) {
  if (!hasSupabaseEnv()) return null;

  const supabase = hasSupabaseServiceRole() ? createSupabaseServiceRoleClient() : await createSupabaseServerClient();
  const { data } = await supabase
    .from("doctor_profiles")
    .select("id, specialty, qualifications, experience_years, consultation_fee, clinic_address, bio, available_days, available_hours")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return null;

  const { data: profileData } = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const profile = (profileData ?? {}) as { full_name?: string };

  return {
    id: data.id,
    fullName: profile.full_name ?? "",
    specialty: data.specialty,
    qualifications: data.qualifications,
    experienceYears: data.experience_years,
    consultationFee: Number(data.consultation_fee),
    clinicAddress: data.clinic_address,
    bio: data.bio,
    availableDays: data.available_days ?? [],
    availableHours: data.available_hours,
    rating: 4.8,
    nextAvailable: data.available_hours,
  };
}

export async function getDoctors() {
  if (!hasSupabaseEnv()) return [];

  const supabase = hasSupabaseServiceRole() ? createSupabaseServiceRoleClient() : await createSupabaseServerClient();
  const { data } = await supabase
    .from("doctor_profiles")
    .select("id, specialty, qualifications, experience_years, consultation_fee, clinic_address, bio, available_days, available_hours")
    .order("created_at", { ascending: false });

  if (!data?.length) {
    return [];
  }

  const doctorIds = (data ?? []).map((doctor) => doctor.id);
  const { data: profileRows } = await supabase.from("profiles").select("id, full_name").in("id", doctorIds);
  const profileMap = new Map((profileRows ?? []).map((profile) => [profile.id, profile.full_name]));

  return (data ?? []).map((doctor) => ({
    id: doctor.id,
    fullName: profileMap.get(doctor.id) ?? "",
    specialty: doctor.specialty,
    consultationFee: Number(doctor.consultation_fee),
    experienceYears: doctor.experience_years,
    clinicAddress: doctor.clinic_address,
    rating: 4.8,
    nextAvailable: doctor.available_hours,
    bio: doctor.bio,
  }));
}

export async function getDoctorAvailability(doctorId: string) {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("doctor_availability").select("id, weekday, start_time, end_time").eq("doctor_id", doctorId).order("weekday", { ascending: true });

  return (data ?? []).map((slot) => ({
    id: slot.id,
    doctorId,
    weekday: slot.weekday,
    startTime: slot.start_time,
    endTime: slot.end_time,
  }));
}

export async function getAppointments(role: "patient" | "doctor" | "admin", userId?: string) {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("appointments")
    .select("id, doctor_id, patient_id, scheduled_at, reason, status, created_at")
    .order("scheduled_at", { ascending: true });

  if (role === "doctor" && userId) {
    query = query.eq("doctor_id", userId);
  }

  if (role === "patient" && userId) {
    query = query.eq("patient_id", userId);
  }

  const now = new Date().toISOString();
  const cleanupQuery = supabase
    .from("appointments")
    .update({ status: "completed" })
    .lt("scheduled_at", now)
    .eq("status", "accepted");

  if (role === "doctor" && userId) {
    cleanupQuery.eq("doctor_id", userId);
  }

  if (role === "patient" && userId) {
    cleanupQuery.eq("patient_id", userId);
  }

  await cleanupQuery;

  const { data } = await query;

  if (!data?.length) {
    return [];
  }

  const profileIds = Array.from(new Set([...(data ?? []).map((appointment) => appointment.doctor_id), ...(data ?? []).map((appointment) => appointment.patient_id)]));
  const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", profileIds);
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]));

  const doctorIds = Array.from(new Set(data.map((appointment) => appointment.doctor_id)));
  const { data: doctorProfiles } = await supabase.from("doctor_profiles").select("id, specialty").in("id", doctorIds);
  const doctorProfileMap = new Map((doctorProfiles ?? []).map((profile) => [profile.id, profile.specialty]));

  return (data ?? []).map((appointment) => ({
    id: appointment.id,
    doctorId: appointment.doctor_id,
    patientId: appointment.patient_id,
    doctorName: profileMap.get(appointment.doctor_id) ?? "Doctor",
    patientName: profileMap.get(appointment.patient_id) ?? "Patient",
    specialty: doctorProfileMap.get(appointment.doctor_id) ?? "General",
    reason: appointment.reason,
    status: appointment.status,
    scheduledAt: appointment.scheduled_at,
    createdAt: appointment.created_at,
  }));
}

export function filterAppointmentsByStatus<T extends { status: string }>(appointments: T[], status: string) {
  return status === "all" ? appointments : appointments.filter((appointment) => appointment.status === status);
}

export async function getReports(userId?: string, options?: { patientId?: string; doctorId?: string }) {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("medical_reports")
    .select("id, patient_id, doctor_id, appointment_id, title, file_name, file_url, storage_path, mime_type, document_type, notes, uploaded_by, created_at")
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.or(`patient_id.eq.${userId},doctor_id.eq.${userId}`);
  }

  if (options?.patientId) {
    query = query.eq("patient_id", options.patientId);
  }

  if (options?.doctorId) {
    query = query.eq("doctor_id", options.doctorId);
  }

  const { data } = await query;

  if (!data?.length) {
    return [];
  }

  const doctorIds = Array.from(new Set(data.filter((report) => report.doctor_id).map((report) => report.doctor_id!)));
  const { data: doctorProfiles } = await supabase.from("profiles").select("id, full_name").in("id", doctorIds);
  const doctorProfileMap = new Map((doctorProfiles ?? []).map((profile) => [profile.id, profile.full_name]));

  return (data ?? []).map((report) => ({
    id: report.id,
    patientId: report.patient_id,
    doctorId: report.doctor_id,
    appointmentId: report.appointment_id,
    title: report.title,
    fileName: report.file_name,
    fileUrl: report.file_url,
    storagePath: report.storage_path,
    mimeType: report.mime_type,
    documentType: (report.document_type as "Medical Report" | "Prescription" | "Lab Report") ?? "Medical Report",
    notes: report.notes,
    doctorName: report.doctor_id ? doctorProfileMap.get(report.doctor_id) ?? null : null,
    uploadedBy: report.uploaded_by,
    createdAt: report.created_at,
  }));
}

export async function getChatHistory(userId: string, otherUserId: string) {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, created_at")
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order("created_at", { ascending: true });

  return (data ?? []).map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id,
    content: msg.content,
    createdAt: msg.created_at,
  }));
}

export async function getChatPartners(userId: string, role: "patient" | "doctor") {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createSupabaseServerClient();
  
  // 1. Fetch appointments to find historical doctor/patient mappings
  const appointments = await getAppointments(role, userId);
  const targetUserIds = new Set<string>();

  appointments.forEach((app) => {
    if (role === "patient") {
      targetUserIds.add(app.doctorId);
    } else {
      targetUserIds.add(app.patientId);
    }
  });

  // 2. Fallback: if no appointments, select other roles from profiles
  let query = supabase.from("profiles").select("id, role, full_name, email, avatar_url");
  
  if (targetUserIds.size > 0) {
    query = query.in("id", Array.from(targetUserIds));
  } else {
    // Return all users of the opposite role as fallback
    query = query.eq("role", role === "patient" ? "doctor" : "patient");
  }

  const { data } = await query;
  return (data ?? []).map((p) => ({
    id: p.id,
    role: p.role,
    fullName: p.full_name,
    email: p.email,
    avatarUrl: p.avatar_url,
  }));
}
