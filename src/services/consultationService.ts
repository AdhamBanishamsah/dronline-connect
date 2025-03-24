
import { Consultation, ConsultationStatus, UserRole, ConsultationComment } from "@/types";
import { MOCK_CONSULTATIONS } from "@/data/mockConsultations";

// Service to handle consultation operations
export const consultationService = {
  getAll: () => {
    return MOCK_CONSULTATIONS;
  },

  create: async (userId: string, consultationData: Partial<Consultation>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newConsultation: Consultation = {
      id: `${MOCK_CONSULTATIONS.length + 1}`,
      patientId: userId,
      disease: consultationData.disease || "",
      description: consultationData.description || "",
      symptoms: consultationData.symptoms || "",
      status: ConsultationStatus.PENDING,
      images: consultationData.images,
      voiceMemo: consultationData.voiceMemo,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    
    MOCK_CONSULTATIONS.unshift(newConsultation);
    return newConsultation;
  },

  getByUserId: (userId: string, role: UserRole) => {
    // For patients, return consultations where they are the patient
    if (role === UserRole.PATIENT) {
      return MOCK_CONSULTATIONS.filter(c => c.patientId === userId);
    }
    
    // For doctors, return consultations where they are the doctor or consultations pending assignment
    if (role === UserRole.DOCTOR) {
      return MOCK_CONSULTATIONS.filter(c => c.doctorId === userId || !c.doctorId);
    }
    
    // For admins, return all consultations
    if (role === UserRole.ADMIN) {
      return MOCK_CONSULTATIONS;
    }
    
    return [];
  },

  getById: (id: string) => {
    return MOCK_CONSULTATIONS.find(c => c.id === id);
  },

  updateStatus: async (id: string, status: ConsultationStatus) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const consultationIndex = MOCK_CONSULTATIONS.findIndex(c => c.id === id);
    if (consultationIndex !== -1) {
      MOCK_CONSULTATIONS[consultationIndex].status = status;
      return MOCK_CONSULTATIONS[consultationIndex];
    }
    throw new Error("Consultation not found");
  },

  assign: async (consultationId: string, doctorId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const consultationIndex = MOCK_CONSULTATIONS.findIndex(c => c.id === consultationId);
    if (consultationIndex !== -1) {
      MOCK_CONSULTATIONS[consultationIndex].doctorId = doctorId;
      MOCK_CONSULTATIONS[consultationIndex].status = ConsultationStatus.IN_PROGRESS;
      return MOCK_CONSULTATIONS[consultationIndex];
    }
    throw new Error("Consultation not found");
  },

  addComment: async (consultationId: string, userId: string, userRole: UserRole, content: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const consultationIndex = MOCK_CONSULTATIONS.findIndex(c => c.id === consultationId);
    if (consultationIndex !== -1) {
      const newComment: ConsultationComment = {
        id: Math.random().toString(36).substring(2, 11),
        consultationId,
        userId,
        userRole,
        content,
        createdAt: new Date().toISOString(),
      };
      
      if (!MOCK_CONSULTATIONS[consultationIndex].comments) {
        MOCK_CONSULTATIONS[consultationIndex].comments = [];
      }
      
      MOCK_CONSULTATIONS[consultationIndex].comments!.push(newComment);
      return newComment;
    }
    throw new Error("Consultation not found");
  }
};
