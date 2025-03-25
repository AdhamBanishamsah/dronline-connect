
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { Consultation, ConsultationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useConsultationDetail = (role?: 'patient' | 'doctor') => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getConsultationById, addConsultationComment, updateConsultation, isLoading: contextLoading } = useConsultations();
  const { toast } = useToast();
  
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [voiceMemo, setVoiceMemo] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isLoading = contextLoading || fetchLoading;
  
  // Define return path based on role
  const returnPath = role === 'doctor' ? '/doctor/consultations' : '/consultations';

  // Load consultation details
  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const consultationData = await getConsultationById(id);
        
        if (consultationData) {
          setConsultation(consultationData);
          setImages(consultationData.images || []);
          setVoiceMemo(consultationData.voiceMemo || "");
        }
      } catch (error) {
        console.error("Error fetching consultation:", error);
        toast({
          title: "Error",
          description: "Failed to load consultation details",
          variant: "destructive",
        });
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchConsultation();
  }, [id, getConsultationById, toast]);

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !commentText.trim() || !user) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(id, commentText);
      
      // Refetch consultation to get updated comments
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
      
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Comment Failed",
        description: "Could not add your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingComment(false);
    }
  };

  // Handle media updates
  const handleUpdateConsultation = async () => {
    if (!id) return;
    
    try {
      setIsUpdating(true);
      
      // Log the current state of images and voice memo before sending
      console.log("Updating consultation with:", { 
        images, 
        voiceMemo, 
        currentImages: consultation?.images 
      });
      
      await updateConsultation(id, {
        images,
        voiceMemo
      });
      
      // Refetch the consultation to get latest data
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
      
      toast({
        title: "Media Updated",
        description: "Media files have been updated successfully",
      });
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast({
        title: "Update Failed",
        description: "Could not update media files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
    images,
    setImages,
    voiceMemo,
    setVoiceMemo,
    isUpdating,
    handleCommentSubmit,
    handleUpdateConsultation,
    returnPath
  };
};
