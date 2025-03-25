
import React, { createContext, useContext, useState, useEffect } from "react";
import { Consultation, UserRole, ConsultationStatus } from "@/types";
import { ConsultationContextType } from "@/types/consultation";
import { useAuth } from "./AuthContext";
import { consultationService } from "@/services/consultationService";
import { useConsultationActions } from "@/hooks/useConsultationActions";

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const { user } = useAuth();
  const {
    isLoading,
    createConsultation,
    updateConsultationStatus,
    assignConsultation,
    addConsultationComment,
    updateConsultation,
  } = useConsultationActions();

  useEffect(() => {
    if (user) {
      loadConsultations();
    }
  }, [user]);

  const loadConsultations = async () => {
    if (!user) return;
    
    try {
      const consultations = await getConsultationsByUserId(user.id, user.role);
      setConsultations(consultations);
    } catch (error) {
      console.error("Error loading consultations:", error);
    }
  };

  const refreshConsultations = async () => {
    await loadConsultations();
  };

  const getConsultationsByUserId = async (userId: string, role: UserRole): Promise<Consultation[]> => {
    return await consultationService.getConsultationsByUserId(userId, role);
  };

  const getConsultationById = async (id: string): Promise<Consultation | null> => {
    return await consultationService.getConsultationById(id);
  };

  // Update local state after operations
  const updateLocalConsultationState = (
    id: string, 
    updatedFields: Partial<Consultation>
  ) => {
    setConsultations(prev => 
      prev.map(consultation => 
        consultation.id === id 
          ? { ...consultation, ...updatedFields } 
          : consultation
      )
    );
  };

  // Wrap the original functions to update local state after operations
  const wrappedUpdateConsultationStatus = async (id: string, status: ConsultationStatus) => {
    await updateConsultationStatus(id, status);
    updateLocalConsultationState(id, { status });
  };

  const wrappedAssignConsultation = async (consultationId: string, doctorId: string) => {
    await assignConsultation(consultationId, doctorId);
    updateLocalConsultationState(consultationId, { 
      doctorId, 
      status: ConsultationStatus.IN_PROGRESS 
    });
  };

  const wrappedAddConsultationComment = async (consultationId: string, content: string) => {
    await addConsultationComment(consultationId, content);
    // We'll need to refetch the consultation to get the updated comments
    const updatedConsultation = await getConsultationById(consultationId);
    if (updatedConsultation) {
      updateLocalConsultationState(consultationId, { 
        comments: updatedConsultation.comments 
      });
    }
  };

  const wrappedUpdateConsultation = async (consultationId: string, data: Partial<Consultation>) => {
    await updateConsultation(consultationId, data);
    updateLocalConsultationState(consultationId, data);
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        isLoading,
        createConsultation,
        getConsultationsByUserId,
        getConsultationById,
        updateConsultationStatus: wrappedUpdateConsultationStatus,
        assignConsultation: wrappedAssignConsultation,
        addConsultationComment: wrappedAddConsultationComment,
        updateConsultation: wrappedUpdateConsultation,
        refreshConsultations,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error("useConsultations must be used within a ConsultationProvider");
  }
  return context;
};
