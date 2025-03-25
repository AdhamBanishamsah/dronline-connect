import React, { createContext, useState, useContext } from "react";
import { consultationService } from "@/services/consultationService";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DiseaseSelectOption } from "@/types/disease";

// Define the context type
interface ConsultationContextType {
  consultations: Consultation[];
  diseases: DiseaseSelectOption[];
  isLoading: boolean;
  createConsultation: (consultationData: Partial<Consultation>) => Promise<void>;
  updateConsultationStatus: (id: string, status: ConsultationStatus) => Promise<void>;
  assignConsultation: (consultationId: string, doctorId: string) => Promise<void>;
  addConsultationComment: (consultationId: string, userId: string, content: string) => Promise<void>;
  getConsultationById: (id: string) => Promise<Consultation | undefined>;
  getConsultationsByUserId: (userId: string, role: UserRole) => Promise<Consultation[]>;
  updateConsultation: (consultationId: string, data: Partial<Consultation>) => Promise<void>;
}

// Create the context
const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

// Create a provider component
export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [diseases, setDiseases] = useState<DiseaseSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createConsultation = async (consultationData: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to create a consultation");
      }
      
      await consultationService.createConsultation(user.id, consultationData);
      
      // Optimistically update the state
      const newConsultation = {
        id: Math.random().toString(), // Temporary ID
        createdAt: new Date().toISOString(),
        status: ConsultationStatus.PENDING,
        ...consultationData,
      } as Consultation;
      
      setConsultations(prev => [...prev, newConsultation]);
      
      toast({
        title: "Consultation created",
        description: "Your consultation has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
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
          consultation.id === id ? { ...consultation, status } : consultation
        )
      );
      
      toast({
        title: "Status updated",
        description: `Consultation status has been updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
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
          consultation.id === consultationId ? { ...consultation, doctorId } : consultation
        )
      );
      
      toast({
        title: "Consultation assigned",
        description: "You have been assigned to this consultation.",
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addConsultationComment = async (consultationId: string, userId: string, content: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to add a comment");
      }
      
      await consultationService.addConsultationComment(consultationId, userId, content);
      
      // Optimistically update the state
      const newComment = {
        id: Math.random().toString(), // Temporary ID
        userId: userId,
        content: content,
        createdAt: new Date().toISOString(),
      };
      
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId
            ? {
                ...consultation,
                comments: [...(consultation.comments || []), newComment],
              }
            : consultation
        )
      );
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Comment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsultation = async (consultationId: string, data: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      
      await consultationService.updateConsultation(consultationId, data);
      
      // Update local state
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId ? { ...consultation, ...data } : consultation
        )
      );
      
      toast({
        title: "Consultation updated",
        description: "Your consultation has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConsultationById = async (id: string) => {
    try {
      setIsLoading(true);
      
      const consultation = await consultationService.getConsultationById(id);
      
      setIsLoading(false);
      return consultation;
    } catch (error) {
      console.error("Error fetching consultation:", error);
      toast({
        title: "Fetch failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return undefined;
    }
  };

  const getConsultationsByUserId = async (userId: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      const consultations = await consultationService.getConsultationsByUserId(userId, role);
      setConsultations(consultations);
      
      return consultations;
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Fetch failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const value: ConsultationContextType = {
    consultations,
    diseases,
    isLoading,
    createConsultation,
    updateConsultationStatus,
    assignConsultation,
    addConsultationComment,
    getConsultationById,
    getConsultationsByUserId,
    updateConsultation,
  };

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
};

// Create a custom hook to use the context
export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error("useConsultations must be used within a ConsultationProvider");
  }
  return context;
};
