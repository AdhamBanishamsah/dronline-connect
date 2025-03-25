
export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export enum ConsultationStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  specialty?: string; // For doctors
  isApproved?: boolean; // For doctors
  isActive?: boolean; // User account status
};

export type Disease = {
  id: string;
  name_en: string;
  name_ar: string;
}

export type Consultation = {
  id: string;
  patientId: string;
  doctorId?: string;
  diseaseId?: string;
  diseaseName?: string;
  disease?: Disease;
  description: string;
  symptoms: string;
  status: ConsultationStatus;
  images?: string[];
  voiceMemo?: string;
  createdAt: string;
  comments?: ConsultationComment[];
};

export type ConsultationComment = {
  id: string;
  consultationId: string;
  userId: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}
