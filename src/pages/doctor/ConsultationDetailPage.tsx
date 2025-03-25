
import React from "react";
import { useConsultationDoctor } from "@/hooks/useConsultationDoctor";
import ConsultationHeader from "@/components/doctor/consultation/ConsultationHeader";
import ConsultationDetails from "@/components/doctor/consultation/ConsultationDetails";
import ConsultationConversation from "@/components/doctor/consultation/ConsultationConversation";
import ConsultationNotFound from "@/components/doctor/consultation/ConsultationNotFound";

const DoctorConsultationDetailPage: React.FC = () => {
  const {
    user,
    consultation,
    commentText,
    setCommentText,
    isLoading,
    isSendingComment,
    isAssigning,
    isCompleting,
    consultationLoading,
    handleCommentSubmit,
    handleAssignToMe,
    handleMarkAsCompleted
  } = useConsultationDoctor();
  
  if (!user) return null;
  
  if (consultationLoading || isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading consultation...</p>
      </div>
    );
  }

  if (!consultation) {
    return <ConsultationNotFound />;
  }

  return (
    <div className="animate-fade-in">
      <ConsultationHeader 
        consultation={consultation}
        userId={user.id}
        isCompleting={isCompleting}
        isAssigning={isAssigning}
        isLoading={isLoading}
        onAssign={handleAssignToMe}
        onComplete={handleMarkAsCompleted}
      />

      <ConsultationDetails consultation={consultation} />
      
      <ConsultationConversation
        consultation={consultation}
        commentText={commentText}
        setCommentText={setCommentText}
        isSendingComment={isSendingComment}
        onSubmitComment={handleCommentSubmit}
      />
    </div>
  );
};

export default DoctorConsultationDetailPage;
