
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { consultationService } from "@/services/consultationService";
import { Consultation, ConsultationStatus } from "@/types";

export const useConsultationActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createConsultation = async (consultationData: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to create a consultation");
      }
      
      await consultationService.createConsultation(user.id, consultationData);
      
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
      
      await consultationService.addConsultationComment(consultationId, user.id, content);
      
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

  return {
    isLoading,
    createConsultation,
    updateConsultationStatus,
    assignConsultation,
    addConsultationComment,
    updateConsultation,
  };
};
