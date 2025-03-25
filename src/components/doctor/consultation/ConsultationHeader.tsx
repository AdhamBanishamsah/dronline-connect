
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, FileImage, MessageCircle } from "lucide-react";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { Button } from "@/components/ui/button";

interface ConsultationHeaderProps {
  consultation: Consultation;
  userId: string;
  isCompleting: boolean;
  isAssigning: boolean;
  isLoading: boolean;
  onAssign: () => Promise<void>;
  onComplete: () => Promise<void>;
}

const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  consultation,
  userId,
  isCompleting,
  isAssigning,
  isLoading,
  onAssign,
  onComplete
}) => {
  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <span className="badge-pending">Available</span>;
      case ConsultationStatus.IN_PROGRESS:
        return <span className="badge-in-progress">In Progress</span>;
      case ConsultationStatus.COMPLETED:
        return <span className="badge-completed">Completed</span>;
    }
  };
  
  const diseaseName = consultation.disease ? consultation.disease.name_en : consultation.diseaseName || "Unknown Disease";
  const hasAttachments = (consultation.images && consultation.images.length > 0) || consultation.voiceMemo;
  const commentCount = consultation.comments?.length || 0;

  return (
    <div className="mb-6">
      <Link to="/doctor/consultations" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Back to Consultations
      </Link>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 mt-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">{diseaseName}</h1>
              <div className="text-sm text-gray-500">
                Created {new Date(consultation.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center mt-2 space-x-3">
                {hasAttachments && (
                  <div className="flex items-center text-gray-600">
                    <FileImage size={16} className="mr-1" />
                    <span className="text-sm">{consultation.images?.length || 1}</span>
                  </div>
                )}
                {commentCount > 0 && (
                  <div className="flex items-center text-gray-600">
                    <MessageCircle size={16} className="mr-1" />
                    <span className="text-sm">{commentCount}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <div>{getStatusBadge(consultation.status)}</div>
              
              {consultation.status === ConsultationStatus.PENDING && (
                <Button 
                  onClick={onAssign} 
                  className="bg-medical-primary hover:opacity-90"
                  disabled={isAssigning || isLoading}
                >
                  {isAssigning ? "Assigning..." : "Assign to Me"}
                </Button>
              )}
              
              {consultation.status === ConsultationStatus.IN_PROGRESS && 
              consultation.doctorId === userId && (
                <Button 
                  onClick={onComplete} 
                  className="bg-medical-completed hover:opacity-90"
                  disabled={isCompleting || isLoading}
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
  );
};

export default ConsultationHeader;
