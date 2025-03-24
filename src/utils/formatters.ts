
import { Consultation, ConsultationStatus } from "@/types";

/**
 * Formats raw database consultation data to match our application's Consultation type
 */
export const formatConsultationData = (data: any): Consultation => {
  return {
    id: data.id,
    patientId: data.patient_id,
    doctorId: data.doctor_id || undefined,
    disease: data.disease,
    description: data.description,
    symptoms: data.symptoms,
    status: data.status as ConsultationStatus,
    images: data.images || undefined,
    voiceMemo: data.voice_memo || undefined,
    createdAt: data.created_at,
    comments: data.consultation_comments?.map((comment: any) => ({
      id: comment.id,
      consultationId: comment.consultation_id,
      userId: comment.user_id,
      userRole: undefined, // We need to query to get this accurately, done in getConsultationById
      content: comment.content,
      createdAt: comment.created_at
    })) || []
  };
};
