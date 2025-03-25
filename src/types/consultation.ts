
import { Consultation, ConsultationStatus, UserRole } from "./index";

export interface ConsultationContextType {
  consultations: Consultation[];
  isLoading: boolean;
  createConsultation: (consultationData: Partial<Consultation>) => Promise<void>;
  getConsultationsByUserId: (userId: string, role: UserRole) => Promise<Consultation[]>;
  getConsultationById: (id: string) => Promise<Consultation | null>;
  updateConsultationStatus: (id: string, status: ConsultationStatus) => Promise<void>;
  assignConsultation: (consultationId: string, doctorId: string) => Promise<void>;
  addConsultationComment: (consultationId: string, content: string) => Promise<void>;
  updateConsultation: (consultationId: string, data: Partial<Consultation>) => Promise<void>;
}
