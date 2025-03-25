
import React from "react";
import { useAdminConsultationDetail } from "@/hooks/useAdminConsultationDetail";
import ConsultationDetailHeader from "@/components/admin/consultation/detail/ConsultationDetailHeader";
import ConsultationInfo from "@/components/admin/consultation/ConsultationInfo";
import ConsultationCommentSection from "@/components/admin/consultation/detail/ConsultationCommentSection";
import EditConsultationDialog from "@/components/admin/consultation/EditConsultationDialog";

const AdminConsultationDetailPage: React.FC = () => {
  const {
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
  } = useAdminConsultationDetail();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading consultation details...</p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Consultation not found</h2>
        <p className="text-gray-600 mb-6">The consultation you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ConsultationDetailHeader
        onEditClick={() => setIsEditDialogOpen(true)}
      />
      
      <ConsultationInfo 
        consultation={consultation} 
        doctors={doctors}
      />
      
      <ConsultationCommentSection
        consultationId={consultation.id}
        comments={consultation.comments || []}
        isSendingComment={isSendingComment}
        setIsSendingComment={setIsSendingComment}
      />
      
      <EditConsultationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        consultation={consultation}
        doctors={doctors}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        selectedDoctorId={selectedDoctorId}
        setSelectedDoctorId={setSelectedDoctorId}
        diseaseId={diseaseId}
        setDiseaseId={setDiseaseId}
        onSave={handleUpdateStatus}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminConsultationDetailPage;
