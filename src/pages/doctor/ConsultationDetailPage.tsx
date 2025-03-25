
import React from "react";
import { useConsultationDetail } from "@/hooks/useConsultationDetail";
import { useConsultationDoctor } from "@/hooks/useConsultationDoctor";
import { ConsultationStatus, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import ConsultationDetails from "@/components/doctor/consultation/ConsultationDetails";
import CommentSection from "@/components/consultation/CommentSection";
import { useLanguage } from "@/context/LanguageContext";
import { formatDistanceToNow } from "date-fns";

const DoctorConsultationDetailPage: React.FC = () => {
  const { t } = useLanguage();
  
  const {
    user,
    consultation,
    commentText,
    setCommentText,
    isLoading: detailLoading,
    isSendingComment,
    handleCommentSubmit,
    returnPath
  } = useConsultationDetail('doctor');

  // Now we pass the consultation ID to useConsultationDoctor
  const {
    isAssigning,
    isCompleting,
    handleAssignToMe,
    handleMarkAsCompleted
  } = useConsultationDoctor(consultation?.id);

  if (!user) return null;
  
  if (detailLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">{t('consultationNotFound')}</h2>
        <p className="text-gray-600 mb-6">{t('consultationNotFoundMessage')}</p>
        <Link to="/doctor/consultations">
          <Button variant="outline">{t('backToConsultations')}</Button>
        </Link>
      </div>
    );
  }

  const diseaseName = consultation.disease ? consultation.disease.name_en : consultation.diseaseName || t('disease');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to={returnPath} className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-2" />
          {t('backToConsultations')}
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-4">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{diseaseName}</h1>
                <div className="text-sm text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                {consultation.status === ConsultationStatus.PENDING && (
                  <Button 
                    onClick={handleAssignToMe} 
                    className="bg-medical-primary hover:opacity-90"
                    disabled={isAssigning}
                  >
                    {isAssigning ? t('assigning') : t('assignToMe')}
                  </Button>
                )}
                
                {consultation.status === ConsultationStatus.IN_PROGRESS && 
                consultation.doctorId === user.id && (
                  <Button 
                    onClick={handleMarkAsCompleted} 
                    className="bg-medical-completed hover:opacity-90"
                    disabled={isCompleting}
                  >
                    {isCompleting ? t('completing') : (
                      <>
                        <Check size={16} className="mr-2" />
                        {t('markAsCompleted')}
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
            disabled={consultation.status === ConsultationStatus.COMPLETED}
          />
        </div>
      )}
    </div>
  );
};

export default DoctorConsultationDetailPage;
