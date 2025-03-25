
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ConsultationInfo from "@/components/admin/consultation/ConsultationInfo";
import EditConsultationDialog from "@/components/admin/consultation/EditConsultationDialog";
import ConsultationDetailHeader from "@/components/admin/consultation/detail/ConsultationDetailHeader";
import ConsultationCommentSection from "@/components/admin/consultation/detail/ConsultationCommentSection";
import { useConsultationDetail } from "@/hooks/useConsultationDetail";

const AdminConsultationDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    consultation,
    isLoading,
    isSendingComment,
    setIsSendingComment,
    editStatus,
    setEditStatus,
    doctors,
    selectedDoctorId,
    setSelectedDoctorId,
    disease,
    setDisease,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleUpdateStatus
  } = useConsultationDetail();

  if (isLoading && !consultation) {
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
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
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
        onOpenChange={setIsEditDialogOpen}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        selectedDoctorId={selectedDoctorId}
        setSelectedDoctorId={setSelectedDoctorId}
        doctors={doctors}
        isLoading={isLoading}
        onSave={handleUpdateStatus}
        disease={disease}
        setDisease={setDisease}
      />
    </div>
  );
};

export default AdminConsultationDetailPage;
