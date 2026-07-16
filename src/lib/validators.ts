import { z } from "zod";

const trimmedText = z.string().trim().min(2).max(120);

export const roleSchema = z.enum(["patient", "doctor", "admin"]);

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const signupSchema = loginSchema.extend({
  fullName: trimmedText,
  role: z.enum(["patient", "doctor"]),
});

export const patientProfileSchema = z.object({
  fullName: trimmedText,
  phone: z.string().trim().min(8).max(24).optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["female", "male", "non_binary", "prefer_not_to_say"]).optional(),
  bloodGroup: z.string().trim().max(10).optional().or(z.literal("")),
  allergies: z.string().trim().optional(),
  emergencyContact: z.string().trim().optional(),
});

export const doctorProfileSchema = z.object({
  fullName: trimmedText,
  phone: z.string().trim().min(8).max(24).optional().or(z.literal("")),
  specialty: trimmedText,
  qualifications: z.string().trim().optional(),
  experienceYears: z.coerce.number().int().min(0).max(80),
  consultationFee: z.coerce.number().min(0),
  clinicAddress: z.string().trim().min(5).max(200),
  bio: z.string().trim().min(20).max(1000),
  availableDays: z.preprocess((value) => {
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return value;
  }, z.array(z.string()).min(1)),
  availableHours: z.string().trim().min(5).max(50),
});

export const appointmentBookingSchema = z.object({
  doctorId: z.string().uuid(),
  scheduledAt: z.string().min(1),
  reason: z.string().trim().min(10).max(500),
});

export const appointmentStatusSchema = z.enum(["pending", "accepted", "declined", "waiting", "cancelled", "completed"]);

export const reportUploadSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(120),
  file: z.instanceof(File).optional(),
});

export const reportUploadPayloadSchema = reportUploadSchema.extend({
  file: z.instanceof(File),
});

export const availabilitySlotSchema = z.object({
  weekday: z.coerce.number().min(0).max(6),
  startTime: z.string().trim().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;
export type ReportUploadInput = z.infer<typeof reportUploadSchema>;
export type ReportUploadPayload = z.infer<typeof reportUploadPayloadSchema>;
export type AvailabilitySlotInput = z.infer<typeof availabilitySlotSchema>;
