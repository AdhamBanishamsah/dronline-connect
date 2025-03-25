
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
              <h1 className="text-2xl font-bold mb-1">{consultation.disease}</h1>
              <div className="text-sm text-gray-500">
                Created {new Date(consultation.createdAt).toLocaleDateString()}
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
