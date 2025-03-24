
import React, { createContext, useContext, useState } from "react";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { consultationService } from "@/services/consultationService";

interface ConsultationContextType {
  consultations: Consultation[];
  isLoading: boolean;
  createConsultation: (consultationData: Partial<Consultation>) => Promise<void>;
  getConsultationsByUserId: (userId: string, role: UserRole) => Consultation[];
  getConsultationById: (id: string) => Consultation | undefined;
  updateConsultationStatus: (id: string, status: ConsultationStatus) => Promise<void>;
  assignConsultation: (consultationId: string, doctorId: string) => Promise<void>;
  addConsultationComment: (consultationId: string, content: string) => Promise<void>;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>(consultationService.getAll());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createConsultation = async (consultationData: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to create a consultation");
      }
      
      await consultationService.create(user.id, consultationData);
      
      // Refresh consultations list
      setConsultations(consultationService.getAll());
      
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

  const getConsultationsByUserId = (userId: string, role: UserRole) => {
    return consultationService.getByUserId(userId, role);
  };

  const getConsultationById = (id: string) => {
    return consultationService.getById(id);
  };

  const updateConsultationStatus = async (id: string, status: ConsultationStatus) => {
    try {
      setIsLoading(true);
      
      await consultationService.updateStatus(id, status);
      
      // Refresh consultations list
      setConsultations(consultationService.getAll());
      
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
      
      await consultationService.assign(consultationId, doctorId);
      
      // Refresh consultations list
      setConsultations(consultationService.getAll());
      
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

  const addConsultationComment = async (consultationId: string, content: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to add a comment");
      }
      
      await consultationService.addComment(consultationId, user.id, user.role, content);
      
      // Refresh consultations list
      setConsultations(consultationService.getAll());
      
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
