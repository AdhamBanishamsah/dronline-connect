
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { ConsultationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useConsultationDoctor = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    assignConsultation,
    updateConsultationStatus,
    getConsultationById,
    isLoading 
  } = useConsultations();
  const { toast } = useToast();
  
  const [isAssigning, setIsAssigning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleAssignToMe = async () => {
    if (!id || !user) return;
    
    try {
      setIsAssigning(true);
      await assignConsultation(id, user.id);
      
      toast({
        title: "Consultation assigned",
        description: "You have been assigned to this consultation.",
      });
      
      // The consultation will be refetched by the parent component
    } catch (error) {
      console.error("Failed to assign consultation:", error);
      toast({
        title: "Assignment failed",
        description: "An error occurred while assigning the consultation.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!id) return;
    
    try {
      setIsCompleting(true);
      await updateConsultationStatus(id, ConsultationStatus.COMPLETED);
      
      toast({
        title: "Consultation completed",
        description: "The consultation has been marked as completed.",
      });
      
      // Redirect back to consultations list after completion
      navigate("/doctor/consultations");
    } catch (error) {
      console.error("Failed to complete consultation:", error);
      toast({
        title: "Completion failed",
        description: "An error occurred while completing the consultation.",
        variant: "destructive",
      });
      setIsCompleting(false);
    }
  };

  return {
    id,
    user,
    isLoading,
    isAssigning,
    isCompleting,
    handleAssignToMe,
    handleMarkAsCompleted
  };
};
