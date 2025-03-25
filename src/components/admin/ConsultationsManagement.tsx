
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Consultation, ConsultationStatus } from "@/types";
import ConsultationFilters from "./consultation/ConsultationFilters";
import ConsultationTable from "./consultation/ConsultationTable";
import ConsultationManagementDialog from "./consultation/ConsultationManagementDialog";
import { useConsultationManagement } from "@/hooks/useConsultationManagement";

const ConsultationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    consultations,
    doctors,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateConsultation
  } = useConsultationManagement();

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
    
    const success = await updateConsultation(
      editDialog.consultation.id,
      editDialog.disease,
      editDialog.status,
      editDialog.doctorId
    );
    
    if (success) {
      setEditDialog({
        isOpen: false,
        consultation: null,
        disease: "",
        status: ConsultationStatus.PENDING,
        doctorId: ""
      });
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
        consultations={consultations}
        doctors={doctors}
        onViewDetails={handleViewDetails}
        onEditConsultation={handleEditConsultation}
        isLoading={isLoading}
      />

      <ConsultationManagementDialog
        editDialog={editDialog}
        setEditDialog={setEditDialog}
        doctors={doctors}
        isLoading={isLoading}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ConsultationsManagement;
