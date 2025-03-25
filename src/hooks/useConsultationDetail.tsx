
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { Consultation, ConsultationStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useConsultationDetail = (role: 'patient' | 'doctor') => {
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

  useEffect(() => {
    const loadConsultation = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const data = await getConsultationById(id);
        setConsultation(data);
        
        // Initialize with existing data
        if (data) {
          setImages(data.images || []);
          setVoiceMemo(data.voiceMemo || "");
        }
      } catch (error) {
        console.error("Error loading consultation:", error);
        toast({
          title: "Error",
          description: "Failed to load consultation details",
          variant: "destructive",
        });
      } finally {
        setFetchLoading(false);
      }
    };
    
    loadConsultation();
  }, [id, getConsultationById, toast]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !id) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(id, commentText);
      setCommentText("");
      
      // Refresh consultation data
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleUpdateConsultation = async () => {
    if (!consultation || !id) return;
    
    try {
      setIsUpdating(true);
      
      await updateConsultation(id, {
        images,
        voiceMemo
      });
      
      // Refresh consultation data
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
      
      toast({
        title: "Consultation updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update consultation:", error);
      toast({
        title: "Error",
        description: "Failed to update consultation",
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
    isLoading: contextLoading || fetchLoading,
    isSendingComment,
    images,
    setImages,
    voiceMemo,
    setVoiceMemo,
    isUpdating,
    handleCommentSubmit,
    handleUpdateConsultation,
    returnPath: role === 'patient' ? '/consultations' : '/doctor/consultations'
  };
};
