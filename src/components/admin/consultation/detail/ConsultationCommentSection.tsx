
import React from "react";
import { useConsultations } from "@/context/ConsultationContext";
import ConsultationComments from "@/components/admin/consultation/ConsultationComments";
import { Consultation, ConsultationComment } from "@/types";

interface ConsultationCommentSectionProps {
  consultationId: string;
  comments: ConsultationComment[];
  isSendingComment: boolean;
  setIsSendingComment: (value: boolean) => void;
}

const ConsultationCommentSection: React.FC<ConsultationCommentSectionProps> = ({
  consultationId,
  comments,
  isSendingComment,
  setIsSendingComment
}) => {
  const { getConsultationById, addConsultationComment } = useConsultations();

  const handleAddComment = async (content: string) => {
    if (!consultationId) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(consultationId, content);
      
      await getConsultationById(consultationId);
      
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSendingComment(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ConsultationComments 
        comments={comments || []}
        onAddComment={handleAddComment}
        isSendingComment={isSendingComment}
      />
    </div>
  );
};

export default ConsultationCommentSection;
