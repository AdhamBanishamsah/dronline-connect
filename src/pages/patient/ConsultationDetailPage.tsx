
import React from "react";
import { useConsultationDetail } from "@/hooks/useConsultationDetail";
import { ConsultationStatus, UserRole } from "@/types";
import ConsultationDetailHeader from "@/components/consultation/ConsultationDetailHeader";
import ConsultationDetails from "@/components/consultation/ConsultationDetails";
import MediaUploader from "@/components/consultation/MediaUploader";
import CommentSection from "@/components/consultation/CommentSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ConsultationDetailPage: React.FC = () => {
  const {
    user,
    consultation,
    commentText,
    setCommentText,
    isLoading,
    isSendingComment,
    images,
    setImages,
    voiceMemo,
    setVoiceMemo,
    isUpdating,
    handleCommentSubmit,
    handleUpdateConsultation,
    returnPath
  } = useConsultationDetail('patient');

  if (!user) return null;
  
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
        <Link to="/consultations">
          <Button variant="outline">Back to Consultations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ConsultationDetailHeader 
        consultation={consultation} 
        returnPath={returnPath}
      />

      <ConsultationDetails consultation={consultation} />
      
      {consultation.status === ConsultationStatus.IN_PROGRESS && (
        <MediaUploader
          images={images}
          setImages={setImages}
          voiceMemo={voiceMemo}
          setVoiceMemo={setVoiceMemo}
          isUpdating={isUpdating}
          onUpdate={handleUpdateConsultation}
        />
      )}
      
      {consultation.status !== ConsultationStatus.PENDING && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <CommentSection
            comments={consultation.comments || []}
            status={consultation.status}
            userRole={UserRole.PATIENT}
            isSendingComment={isSendingComment}
            onCommentSubmit={handleCommentSubmit}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        </div>
      )}
    </div>
  );
};

export default ConsultationDetailPage;
