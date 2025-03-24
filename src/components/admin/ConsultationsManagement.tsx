
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Consultation, ConsultationStatus } from "@/types";
import { formatConsultationData } from "@/utils/formatters";
import ConsultationFilters from "./consultation/ConsultationFilters";
import ConsultationTable from "./consultation/ConsultationTable";
import EditConsultationDialog from "./consultation/EditConsultationDialog";

interface Doctor {
  id: string;
  full_name: string;
}

const ConsultationsManagement: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    consultation: Consultation | null;
    disease: string;
    status: ConsultationStatus;
    doctorId: string;
  }>({
    isOpen: false,
    consultation: null,
    disease: "",
    status: ConsultationStatus.PENDING,
    doctorId: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [searchQuery, statusFilter, consultations]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "doctor")
        .eq("is_approved", true);
        
      if (error) throw error;
      
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
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

  const handleViewDetails = (id: string) => {
    navigate(`/admin/consultations/${id}`);
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setEditDialog({
      isOpen: true,
      consultation,
      disease: consultation.disease,
      status: consultation.status as ConsultationStatus,
      doctorId: consultation.doctorId || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editDialog.consultation) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("consultations")
        .update({ 
          disease: editDialog.disease,
          status: editDialog.status,
          doctor_id: editDialog.doctorId || null
        })
        .eq("id", editDialog.consultation.id);
        
      if (error) throw error;
      
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === editDialog.consultation?.id 
            ? { 
                ...consultation, 
                disease: editDialog.disease,
                status: editDialog.status,
                doctorId: editDialog.doctorId
              } 
            : consultation
        )
      );
      
      toast({
        title: "Consultation updated",
        description: "The consultation has been updated successfully",
      });
      
      setEditDialog({
        isOpen: false,
        consultation: null,
        disease: "",
        status: ConsultationStatus.PENDING,
        doctorId: ""
      });
    } catch (error) {
      console.error("Failed to update consultation:", error);
      toast({
        title: "Update failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ConsultationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ConsultationTable 
        consultations={filteredConsultations}
        doctors={doctors}
        onViewDetails={handleViewDetails}
        onEditConsultation={handleEditConsultation}
        isLoading={isLoading}
      />

      <EditConsultationDialog
        isOpen={editDialog.isOpen}
        onOpenChange={(open) => !open && setEditDialog(prev => ({ ...prev, isOpen: false }))}
        disease={editDialog.disease}
        setDisease={(disease) => setEditDialog(prev => ({ ...prev, disease }))}
        editStatus={editDialog.status}
        setEditStatus={(status) => setEditDialog(prev => ({ ...prev, status }))}
        selectedDoctorId={editDialog.doctorId}
        setSelectedDoctorId={(doctorId) => setEditDialog(prev => ({ ...prev, doctorId }))}
        doctors={doctors}
        isLoading={isLoading}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ConsultationsManagement;
