export type Role = "patient" | "doctor" | "admin";

export type AppointmentStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "waiting"
  | "cancelled"
  | "completed";

export type Gender = "female" | "male" | "non_binary" | "prefer_not_to_say";

export interface Profile {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface PatientProfile extends Profile {
  role: "patient";
  dateOfBirth?: string | null;
  gender?: Gender | null;
  bloodGroup?: string | null;
  allergies?: string[];
  emergencyContact?: string | null;
}

export interface DoctorProfile extends Profile {
  role: "doctor";
  specialty: string;
  qualifications?: string | null;
  experienceYears?: number | null;
  consultationFee?: number | null;
  clinicAddress?: string | null;
  bio?: string | null;
  availableDays?: string[];
  availableHours?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  specialty: string;
  reason: string;
  status: AppointmentStatus;
  scheduledAt: string;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId?: string | null;
  appointmentId?: string | null;
  title: string;
  fileName: string;
  fileUrl: string;
  storagePath?: string | null;
  mimeType: string;
  documentType: "Medical Report" | "Prescription" | "Lab Report";
  notes?: string | null;
  doctorName?: string | null;
  uploadedBy: Role;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface DoctorSummary {
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
