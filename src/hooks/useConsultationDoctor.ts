
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { ConsultationStatus, Consultation } from "@/types";

export const useConsultationDoctor = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    getConsultationById, 
    addConsultationComment, 
    assignConsultation,
    updateConsultationStatus,
    isLoading 
  } = useConsultations();
  
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [consultationLoading, setConsultationLoading] = useState(true);

  useEffect(() => {
    const loadConsultation = async () => {
      if (!id || !user) return;
      
      try {
        setConsultationLoading(true);
        const data = await getConsultationById(id);
        setConsultation(data);
      } catch (error) {
        console.error("Failed to load consultation:", error);
      } finally {
        setConsultationLoading(false);
      }
    };
    
    loadConsultation();
  }, [id, user, getConsultationById]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !id) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(id, commentText);
      setCommentText("");
      
      // Refresh consultation to get the new comment
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleAssignToMe = async () => {
    if (!id || !user) return;
    
    try {
      setIsAssigning(true);
      await assignConsultation(id, user.id);
      
      // Refresh consultation to get the updated status
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
    } catch (error) {
      console.error("Failed to assign consultation:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!id) return;
    
    try {
      setIsCompleting(true);
      await updateConsultationStatus(id, ConsultationStatus.COMPLETED);
      // Redirect back to consultations list after completion
      navigate("/doctor/consultations");
    } catch (error) {
      console.error("Failed to complete consultation:", error);
      setIsCompleting(false);
    }
  };

  return {
    id,
    user,
    consultation,
    commentText,
    setCommentText,
    isLoading,
    isSendingComment,
    isAssigning,
    isCompleting,
    consultationLoading,
    handleCommentSubmit,
    handleAssignToMe,
    handleMarkAsCompleted
  };
};
