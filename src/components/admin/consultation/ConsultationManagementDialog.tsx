
import React from "react";
import { Consultation, ConsultationStatus } from "@/types";
import EditConsultationDialog from "./EditConsultationDialog";

interface Doctor {
  id: string;
  full_name: string;
}

interface ConsultationManagementDialogProps {
  editDialog: {
    isOpen: boolean;
    consultation: Consultation | null;
    diseaseId: string;
    status: ConsultationStatus;
    doctorId: string;
  };
  setEditDialog: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    consultation: Consultation | null;
    diseaseId: string;
    status: ConsultationStatus;
    doctorId: string;
  }>>;
  doctors: Doctor[];
  isLoading: boolean;
  onSave: () => Promise<void>;
}

const ConsultationManagementDialog: React.FC<ConsultationManagementDialogProps> = ({
  editDialog,
  setEditDialog,
  doctors,
  isLoading,
  onSave
}) => {
  return (
    <EditConsultationDialog
      isOpen={editDialog.isOpen}
      onOpenChange={(open) => !open && setEditDialog(prev => ({ ...prev, isOpen: false }))}
      diseaseId={editDialog.diseaseId}
      setDiseaseId={(diseaseId) => setEditDialog(prev => ({ ...prev, diseaseId }))}
      editStatus={editDialog.status}
      setEditStatus={(status) => setEditDialog(prev => ({ ...prev, status }))}
      selectedDoctorId={editDialog.doctorId}
      setSelectedDoctorId={(doctorId) => setEditDialog(prev => ({ ...prev, doctorId }))}
      doctors={doctors}
      isLoading={isLoading}
      onSave={onSave}
    />
  );
};

export default ConsultationManagementDialog;
