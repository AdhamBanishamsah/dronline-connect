
import React, { createContext, useState, useContext, useEffect } from "react";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { consultationService } from "@/services/consultationService";
import { useAuth } from "@/hooks/useAuth";
import { ConsultationContextType } from "@/types/consultation";

const ConsultationContext = createContext<ConsultationContextType>({
  consultations: [],
  isLoading: false,
  createConsultation: async () => {},
  getConsultationsByUserId: async () => [],
  getConsultationById: async () => null,
  updateConsultationStatus: async () => {},
  assignConsultation: async () => {},
  addConsultationComment: async () => {},
  updateConsultation: async () => {},
  refreshConsultations: async () => {},
});

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshConsultations = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const userConsultations = await consultationService.getConsultationsByUserId(
        user.id,
        user.role
      );
      setConsultations(userConsultations);
    } catch (error) {
      console.error("Error refreshing consultations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshConsultations();
    }
  }, [user]);

  const createConsultation = async (consultationData: Partial<Consultation>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      const createdConsultation = await consultationService.createConsultation(
        user.id,
        consultationData
      );
      
      if (createdConsultation) {
        setConsultations(prev => [createdConsultation, ...prev]);
      }
    } catch (error) {
      console.error("Error creating consultation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConsultationsByUserId = async (userId: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const userConsultations = await consultationService.getConsultationsByUserId(
        userId,
        role
      );
      setConsultations(userConsultations);
      return userConsultations;
    } catch (error) {
      console.error("Error fetching consultations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getConsultationById = async (id: string) => {
    try {
      setIsLoading(true);
      const consultation = await consultationService.getConsultationById(id);
      return consultation;
    } catch (error) {
      console.error("Error fetching consultation:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsultationStatus = async (id: string, status: ConsultationStatus) => {
    try {
      setIsLoading(true);
      await consultationService.updateConsultationStatus(id, status);
      
      // Update local state
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === id
            ? { ...consultation, status }
            : consultation
        )
      );
    } catch (error) {
      console.error("Error updating consultation status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const assignConsultation = async (consultationId: string, doctorId: string) => {
    try {
      setIsLoading(true);
      await consultationService.assignConsultation(consultationId, doctorId);
      
      // Update local state
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId
            ? {
                ...consultation,
                doctorId,
                status: ConsultationStatus.IN_PROGRESS,
              }
            : consultation
        )
      );
    } catch (error) {
      console.error("Error assigning consultation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addConsultationComment = async (consultationId: string, content: string, userId: string) => {
    try {
      setIsLoading(true);
      const comment = await consultationService.addConsultationComment(consultationId, userId, content);
      
      // Update local state if the consultation exists in our current state
      setConsultations(prev => 
        prev.map(consultation => {
          if (consultation.id === consultationId) {
            const newComment = {
              id: comment.id,
              consultationId: comment.consultation_id,
              userId: comment.user_id,
              userRole: user?.role || UserRole.PATIENT, // Use the current user's role
              content: comment.content,
              createdAt: comment.created_at
            };
            
            return {
              ...consultation,
              comments: consultation.comments ? [...consultation.comments, newComment] : [newComment]
            };
          }
          return consultation;
        })
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsultation = async (consultationId: string, data: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      await consultationService.updateConsultation(consultationId, data);
      
      // Update local state if exists
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId
            ? { ...consultation, ...data }
            : consultation
        )
      );
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        isLoading,
        createConsultation,
        getConsultationsByUserId,
        getConsultationById,
        updateConsultationStatus,
        assignConsultation,
        addConsultationComment,
        updateConsultation,
        refreshConsultations,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultations = () => useContext(ConsultationContext);
