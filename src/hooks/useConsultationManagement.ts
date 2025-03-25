
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Consultation, ConsultationStatus } from "@/types";
import { formatConsultationData } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import { doctorService } from "@/services/doctorService";

interface Doctor {
  id: string;
  full_name: string;
}

export const useConsultationManagement = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultations();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [searchQuery, statusFilter, consultations]);

  const fetchDoctors = async () => {
    const doctorsData = await doctorService.fetchDoctors();
    setDoctors(doctorsData);
  };

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          *,
          consultation_comments (*)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;

      const formattedConsultations = data.map(item => formatConsultationData(item));
      setConsultations(formattedConsultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error fetching consultations",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterConsultations = () => {
    let filtered = [...consultations];
    
    if (searchQuery) {
      filtered = filtered.filter(consultation => 
        consultation.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== null) {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }
    
    setFilteredConsultations(filtered);
  };

  const updateConsultation = async (
    consultationId: string,
    disease: string,
    status: ConsultationStatus,
    doctorId: string
  ) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("consultations")
        .update({ 
          disease: disease,
          status: status,
          doctor_id: doctorId || null
        })
        .eq("id", consultationId);
        
      if (error) throw error;
      
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId 
            ? { 
                ...consultation, 
                disease: disease,
                status: status,
                doctorId: doctorId
              } 
            : consultation
        )
      );
      
      toast({
        title: "Consultation updated",
        description: "The consultation has been updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to update consultation:", error);
      toast({
        title: "Update failed",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    consultations: filteredConsultations,
    doctors,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateConsultation
  };
};
