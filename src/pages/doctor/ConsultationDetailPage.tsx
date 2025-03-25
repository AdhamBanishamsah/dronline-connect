
import React from "react";
import { useConsultationDetail } from "@/hooks/useConsultationDetail";
import { useConsultationDoctor } from "@/hooks/useConsultationDoctor";
import { ConsultationStatus, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import ConsultationDetails from "@/components/consultation/ConsultationDetails";
import MediaUploader from "@/components/consultation/MediaUploader";
import CommentSection from "@/components/consultation/CommentSection";
import ConsultationDetailHeader from "@/components/consultation/ConsultationDetailHeader";

const DoctorConsultationDetailPage: React.FC = () => {
  const {
    user,
    consultation,
    commentText,
    setCommentText,
    isLoading: detailLoading,
    isSendingComment,
    images,
    setImages,
    voiceMemo,
    setVoiceMemo,
    isUpdating,
    handleCommentSubmit,
    handleUpdateConsultation,
    returnPath
  } = useConsultationDetail('doctor');

  const {
    isAssigning,
    isCompleting,
    handleAssignToMe,
    handleMarkAsCompleted
  } = useConsultationDoctor();

  if (!user) return null;
  
  if (detailLoading) {
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
        <Link to="/doctor/consultations">
          <Button variant="outline">Back to Consultations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to={returnPath} className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Consultations
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-4">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{consultation.disease ? consultation.disease.name_en : consultation.diseaseName || "Unknown Disease"}</h1>
                <div className="text-sm text-gray-500 mt-1">
                  Created {new Date(consultation.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                {consultation.status === ConsultationStatus.PENDING && (
                  <Button 
                    onClick={handleAssignToMe} 
                    className="bg-medical-primary hover:opacity-90"
                    disabled={isAssigning}
                  >
                    {isAssigning ? "Assigning..." : "Assign to Me"}
                  </Button>
                )}
                
                {consultation.status === ConsultationStatus.IN_PROGRESS && 
                consultation.doctorId === user.id && (
                  <Button 
                    onClick={handleMarkAsCompleted} 
                    className="bg-medical-completed hover:opacity-90"
                    disabled={isCompleting}
                  >
                    {isCompleting ? "Completing..." : (
                      <>
                        <Check size={16} className="mr-2" />
                        Mark as Completed
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
            userRole={UserRole.DOCTOR}
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

export default DoctorConsultationDetailPage;
