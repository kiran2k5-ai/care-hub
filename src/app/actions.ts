"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  appointmentBookingSchema,
  doctorProfileSchema,
  loginSchema,
  patientProfileSchema,
  reportUploadSchema,
  signupSchema,
  type AppointmentBookingInput,
  type DoctorProfileInput,
  type LoginInput,
  type PatientProfileInput,
  type ReportUploadInput,
  type SignupInput,
} from "@/lib/validators";
import { hasSupabaseEnv } from "@/lib/supabase/config";

function redirectForRole(role: string) {
  if (role === "doctor") {
    redirect("/doctor/dashboard");
  }

  if (role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/patient/dashboard");
}

async function upsertBaseProfile({
  supabase,
  userId,
  email,
  fullName,
  role,
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  email: string;
  fullName: string;
  role: "patient" | "doctor" | "admin";
}) {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    role,
    full_name: fullName,
    email,
  });

  if (error) {
    return { error: error.message };
  }

  if (role === "patient") {
    const { error: patientError } = await supabase.from("patient_profiles").upsert({
      id: userId,
    });

    if (patientError) {
      return { error: patientError.message };
    }
  }

  if (role === "doctor") {
    const { error: doctorError } = await supabase.from("doctor_profiles").upsert({
      id: userId,
      specialty: "General Medicine",
      qualifications: "To be updated",
      experience_years: 0,
      consultation_fee: 0,
      clinic_address: "To be updated",
      bio: "Profile pending completion.",
      available_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      available_hours: "09:00-17:00",
    });

    if (doctorError) {
      return { error: doctorError.message };
    }

    const defaultAvailabilities = [1, 2, 3, 4, 5].map((weekday) => ({
      doctor_id: userId,
      weekday,
      start_time: "09:00:00",
      end_time: "17:00:00",
    }));

    await supabase.from("doctor_availability").upsert(defaultAvailabilities, { onConflict: "doctor_id, weekday, start_time, end_time" });
  }

  return { success: true };
}

export async function signInAction(values: LoginInput) {
  const payload = loginSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    return { error: error.message };
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return { error: "Login succeeded but no user session was found." };
  }

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!data?.role) {
    await upsertBaseProfile({
      supabase,
      userId: user.id,
      email: user.email ?? payload.email,
      fullName: String(user.user_metadata?.full_name ?? user.email ?? payload.email),
      role: (user.user_metadata?.role as "patient" | "doctor" | "admin" | undefined) ?? "patient",
    });
  }

  redirectForRole((data?.role as string | undefined) ?? (user.user_metadata?.role as string | undefined) ?? "patient");
}

export async function signUpAction(values: SignupInput) {
  const payload = signupSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        role: payload.role,
      },
    },
  });

  if (error) {
    const normalizedMessage = error.message.toLowerCase();
    const shouldFallbackToLogin =
      normalizedMessage.includes("rate limit") ||
      normalizedMessage.includes("already registered") ||
      normalizedMessage.includes("user already exists");

    if (shouldFallbackToLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (!signInError) {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if (user) {
          await upsertBaseProfile({
            supabase,
            userId: user.id,
            email: user.email ?? payload.email,
            fullName: payload.fullName,
            role: payload.role,
          });

          redirectForRole(payload.role);
        }
      }

      return {
        error: "This email already exists or confirmation messages are being rate-limited. Please sign in instead.",
      };
    }

    return { error: error.message };
  }

  if (!data.user) {
    return {
      success: true,
      needsConfirmation: true,
      message: "Check your email to confirm your account, then sign in.",
    };
  }

  if (!data.session) {
    return {
      success: true,
      needsConfirmation: true,
      message: "Check your email to confirm your account, then sign in.",
    };
  }

  const profileResult = await upsertBaseProfile({
    supabase,
    userId: data.user.id,
    email: data.user.email ?? payload.email,
    fullName: payload.fullName,
    role: payload.role,
  });

  if (profileResult.error) {
    return { error: profileResult.error };
  }

  redirectForRole(payload.role);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function savePatientProfileAction(values: PatientProfileInput) {
  const payload = patientProfileSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const allergies = payload.allergies
    ? payload.allergies.split(",").map((entry) => entry.trim()).filter(Boolean)
    : [];

  const { error: profileError } = await supabase.from("profiles").update({
    full_name: payload.fullName,
    phone: payload.phone || null,
  }).eq("id", authData.user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  const { error } = await supabase.from("patient_profiles").upsert({
    id: authData.user.id,
    date_of_birth: payload.dateOfBirth || null,
    gender: payload.gender || null,
    blood_group: payload.bloodGroup || null,
    allergies,
    emergency_contact: payload.emergencyContact || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/profile");
  return { success: true };
}

export async function saveDoctorProfileAction(values: DoctorProfileInput) {
  const payload = doctorProfileSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { error: profileError } = await supabase.from("profiles").update({
    full_name: payload.fullName,
    phone: payload.phone || null,
  }).eq("id", authData.user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  const { error } = await supabase.from("doctor_profiles").upsert({
    id: authData.user.id,
    specialty: payload.specialty,
    qualifications: payload.qualifications || null,
    experience_years: payload.experienceYears,
    consultation_fee: payload.consultationFee,
    clinic_address: payload.clinicAddress,
    bio: payload.bio,
    available_days: payload.availableDays,
    available_hours: payload.availableHours,
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("doctor_availability").delete().eq("doctor_id", authData.user.id);

  let newAvailabilities = [];
  if (payload.weeklySlots && payload.weeklySlots.length > 0) {
    newAvailabilities = payload.weeklySlots.map((slot) => {
      const start = slot.startTime.includes(":") && slot.startTime.split(":")[1].length === 2 ? `${slot.startTime}:00` : slot.startTime;
      const end = slot.endTime.includes(":") && slot.endTime.split(":")[1].length === 2 ? `${slot.endTime}:00` : slot.endTime;
      return {
        doctor_id: authData.user.id,
        weekday: slot.weekday,
        start_time: start.padEnd(8, ":00"),
        end_time: end.padEnd(8, ":00"),
      };
    });
  } else {
    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const [startTimeStr, endTimeStr] = (payload.availableHours || "09:00-17:00").split("-");
    const startTime = (startTimeStr || "09:00").trim() + (startTimeStr?.includes(":") && startTimeStr.split(":")[1].length === 2 ? ":00" : "");
    const endTime = (endTimeStr || "17:00").trim() + (endTimeStr?.includes(":") && endTimeStr.split(":")[1].length === 2 ? ":00" : "");

    newAvailabilities = payload.availableDays.map(day => ({
      doctor_id: authData.user.id,
      weekday: dayMap[day.toLowerCase()],
      start_time: startTime.padEnd(8, ":00"),
      end_time: endTime.padEnd(8, ":00"),
    })).filter(a => a.weekday !== undefined);
  }

  if (newAvailabilities.length > 0) {
    await supabase.from("doctor_availability").insert(newAvailabilities);
  }

  revalidatePath("/doctor/profile");
  revalidatePath("/patient/doctors");
  return { success: true };
}

export async function createAppointmentAction(values: AppointmentBookingInput) {
  const payload = appointmentBookingSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { error } = await supabase.from("appointments").insert({
    doctor_id: payload.doctorId,
    patient_id: authData.user.id,
    scheduled_at: payload.scheduledAt,
    reason: payload.reason,
    status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/appointments");
  revalidatePath("/patient/dashboard");
  revalidatePath("/doctor/dashboard");
  return { success: true };
}

export async function updateAppointmentStatusAction(input: { appointmentId: string; status: "pending" | "accepted" | "declined" | "waiting" | "cancelled" | "completed" }) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { data: appointmentData, error: fetchError } = await supabase
    .from("appointments")
    .select("scheduled_at")
    .eq("id", input.appointmentId)
    .eq("doctor_id", authData.user.id)
    .single();

  if (fetchError || !appointmentData) {
    return { error: "Appointment not found." };
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: input.status })
    .eq("id", input.appointmentId)
    .eq("doctor_id", authData.user.id);

  if (error) {
    return { error: error.message };
  }

  if (input.status === "accepted") {
    const { data: conflictingAppointments } = await supabase
      .from("appointments")
      .select("id, patient_id")
      .eq("doctor_id", authData.user.id)
      .eq("scheduled_at", appointmentData.scheduled_at)
      .eq("status", "pending")
      .neq("id", input.appointmentId);

    if (conflictingAppointments && conflictingAppointments.length > 0) {
      const conflictIds = conflictingAppointments.map(a => a.id);
      
      await supabase
        .from("appointments")
        .update({ status: "declined" })
        .in("id", conflictIds);

      const notifications = conflictingAppointments.map(a => ({
        user_id: a.patient_id,
        title: "Appointment Rescheduled",
        body: "The time slot you requested has been filled. Please check the doctor's calendar and book another available slot.",
      }));

      await supabase.from("notifications").insert(notifications);
    }
  }

  revalidatePath("/doctor/appointments");
  revalidatePath("/doctor/dashboard");
  revalidatePath("/doctor/calendar");
  revalidatePath("/patient/appointments");
  return { success: true };
}

export async function cancelAppointmentAction(input: { appointmentId: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    return { error: profileError.message };
  }

  const role = profileData?.role;
  if (role !== "patient" && role !== "doctor") {
    return { error: "Only patients or doctors can cancel appointments." };
  }

  let query = supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", input.appointmentId)
    .in("status", ["pending", "accepted", "waiting"]);

  if (role === "doctor") {
    query = query.eq("doctor_id", authData.user.id);
  } else {
    query = query.eq("patient_id", authData.user.id);
  }

  const { error } = await query;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/appointments");
  revalidatePath("/patient/dashboard");
  revalidatePath("/doctor/appointments");
  revalidatePath("/doctor/dashboard");
  return { success: true };
}

export async function rescheduleAppointmentAction(input: { appointmentId: string; scheduledAt: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    return { error: profileError.message };
  }

  const role = profileData?.role;
  if (role !== "patient" && role !== "doctor") {
    return { error: "Only patients or doctors can reschedule appointments." };
  }

  let query = supabase
    .from("appointments")
    .update({ scheduled_at: input.scheduledAt, status: "pending" })
    .eq("id", input.appointmentId)
    .in("status", ["pending", "accepted", "waiting"]);

  if (role === "doctor") {
    query = query.eq("doctor_id", authData.user.id);
  } else {
    query = query.eq("patient_id", authData.user.id);
  }

  const { error } = await query;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/appointments");
  revalidatePath("/patient/dashboard");
  revalidatePath("/doctor/appointments");
  revalidatePath("/doctor/dashboard");
  return { success: true };
}

export async function createReportAction(values: ReportUploadInput) {
  const payload = reportUploadSchema.parse(values);
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { error } = await supabase.from("medical_reports").insert({
    patient_id: payload.patientId,
    doctor_id: payload.doctorId ?? authData.user.id,
    appointment_id: payload.appointmentId ?? null,
    title: payload.title,
    file_name: payload.title,
    file_url: "",
    mime_type: "application/pdf",
    uploaded_by: "doctor",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/records");
  revalidatePath("/doctor/patients");
  return { success: true };
}

export async function uploadMedicalReportAction(formData: FormData) {
  const payload = reportUploadSchema.parse({
    patientId: String(formData.get("patientId") ?? ""),
    doctorId: formData.get("doctorId") ? String(formData.get("doctorId")) : undefined,
    appointmentId: formData.get("appointmentId") ? String(formData.get("appointmentId")) : undefined,
    title: String(formData.get("title") ?? ""),
  });
  const documentType = String(formData.get("documentType") ?? "Medical Report");
  const notes = String(formData.get("notes") ?? "");

  const rawFile = formData.get("file");

  if (!hasSupabaseEnv()) {
    return { error: "Set Supabase credentials to enable file uploads." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
  if (profileData?.role !== "doctor") {
    return { error: "Only doctors can upload medical documents." };
  }

  if (!(rawFile instanceof File)) {
    return { error: "Please choose a file." };
  }

  const file = rawFile;

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Use PDF, PNG, JPG, or WEBP files only." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "File size must be 10 MB or smaller." };
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const storagePath = `${payload.patientId}/${crypto.randomUUID()}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("medical-reports").upload(storagePath, fileBuffer, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: signed } = await supabase.storage.from("medical-reports").createSignedUrl(storagePath, 60 * 60 * 24 * 7);

  const { error } = await supabase.from("medical_reports").insert({
    patient_id: payload.patientId,
    doctor_id: payload.doctorId ?? authData.user.id,
    appointment_id: payload.appointmentId ?? null,
    title: payload.title,
    file_name: file.name,
    file_url: signed?.signedUrl ?? storagePath,
    storage_path: storagePath,
    mime_type: file.type,
    document_type: documentType,
    notes: notes || null,
    uploaded_by: authData.user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/records");
  revalidatePath("/doctor/patients");
  return { success: true };
}

export async function deleteMedicalReportAction(input: { reportId: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
  if (profileData?.role !== "doctor") {
    return { error: "Only doctors can remove uploaded documents." };
  }

  const { error } = await supabase.from("medical_reports").delete().eq("id", input.reportId).eq("doctor_id", authData.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/patient/records");
  revalidatePath("/doctor/patients");
  return { success: true };
}

export async function getAvailableSlotsAction(input: { doctorId: string; date: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: availability, error: availabilityError } = await supabase
    .from("doctor_availability")
    .select("weekday, start_time, end_time")
    .eq("doctor_id", input.doctorId)
    .order("weekday", { ascending: true });

  if (availabilityError) {
    return { slots: [], error: availabilityError.message };
  }

  const targetDate = new Date(input.date);
  if (Number.isNaN(targetDate.getTime())) {
    return { slots: [], error: "Invalid booking date." };
  }

  const weekday = targetDate.getDay();
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("scheduled_at")
    .eq("doctor_id", input.doctorId)
    .in("status", ["pending", "accepted", "waiting"]);

  if (appointmentsError) {
    return { slots: [], error: appointmentsError.message };
  }

  const bookedTimes = new Set((appointments ?? []).map((appointment) => new Date(appointment.scheduled_at).toISOString()));

  const slots = (availability ?? [])
    .filter((slot) => slot.weekday === weekday)
    .flatMap((slot) => {
      const start = new Date(`${input.date}T${slot.start_time}Z`);
      const end = new Date(`${input.date}T${slot.end_time}Z`);
      const generated: string[] = [];
      const current = new Date(start);
      while (current < end) {
        const slotValue = current.toISOString();
        if (!bookedTimes.has(slotValue)) {
          generated.push(slotValue);
        }
        current.setMinutes(current.getMinutes() + 30);
      }
      return generated;
    });

  return { slots: Array.from(new Set(slots)) };
}

export async function saveAvailabilityAction(values: { doctorId: string; weekday: number; startTime: string; endTime: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { error: "Not signed in." };
  }

  const { error } = await supabase.from("doctor_availability").upsert({
    doctor_id: values.doctorId,
    weekday: values.weekday,
    start_time: values.startTime,
    end_time: values.endTime,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/doctor/profile");
  return { success: true };
}

export async function sendMessageAction(payload: { receiverId: string; content: string }) {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase environment not configured." };
  }

  if (!payload.content.trim()) {
    return { error: "Message content cannot be empty." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return { error: "Not authenticated." };
    }

    const senderId = userData.user.id;

    const { error } = await supabase.from("messages").insert({
      sender_id: senderId,
      receiver_id: payload.receiverId,
      content: payload.content.trim(),
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/patient/messages");
    revalidatePath("/doctor/messages");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to send message." };
  }
}
