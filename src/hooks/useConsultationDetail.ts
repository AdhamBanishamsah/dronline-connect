
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useConsultations } from "@/context/ConsultationContext";
import { Consultation, ConsultationStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { doctorService } from "@/services/doctorService";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  full_name: string;
}

export const useConsultationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getConsultationById, updateConsultationStatus } = useConsultations();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [editStatus, setEditStatus] = useState<ConsultationStatus>(ConsultationStatus.PENDING);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("unassigned");
  const [diseaseId, setDiseaseId] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const doctorsData = await doctorService.fetchDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, [toast]);

  useEffect(() => {
    const loadConsultation = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getConsultationById(id);
        setConsultation(data);
        if (data) {
          setEditStatus(data.status);
          setSelectedDoctorId(data.doctorId || "unassigned");
          setDiseaseId(data.diseaseId || "");
        }
      } catch (error) {
        console.error("Error loading consultation:", error);
        toast({
          title: "Error",
          description: "Failed to load consultation details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConsultation();
  }, [id, getConsultationById, toast]);

  const handleUpdateStatus = async () => {
    if (!consultation) return;
    
    try {
      setIsLoading(true);
      
      await updateConsultationStatus(consultation.id, editStatus);
      
      // Convert "unassigned" to null for the database
      const doctorIdToSet = selectedDoctorId === "unassigned" ? null : selectedDoctorId;
      
      if (doctorIdToSet !== consultation.doctorId) {
        const { error } = await supabase
          .from("consultations")
          .update({ doctor_id: doctorIdToSet })
          .eq("id", consultation.id);
          
        if (error) throw error;
      }
      
      // Update disease if changed
      if (diseaseId !== consultation.diseaseId) {
        const { error } = await supabase
          .from("consultations")
          .update({ disease_id: diseaseId })
          .eq("id", consultation.id);
          
        if (error) throw error;
      }
      
      const updatedConsultation = await getConsultationById(id!);
      setConsultation(updatedConsultation);
      
      toast({
        title: "Consultation updated",
        description: "Status and doctor assignment updated successfully",
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast({
        title: "Error",
        description: "Failed to update consultation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    id,
    consultation,
    isLoading,
    isSendingComment,
    setIsSendingComment,
    editStatus,
    setEditStatus,
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    diseaseId,
    setDiseaseId,
    isEditDialogOpen, 
    setIsEditDialogOpen,
    handleUpdateStatus
  };
};
