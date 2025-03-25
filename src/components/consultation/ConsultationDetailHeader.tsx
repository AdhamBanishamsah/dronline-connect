
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Consultation, ConsultationStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";

interface ConsultationDetailHeaderProps {
  consultation: Consultation;
  returnPath: string;
}

const ConsultationDetailHeader: React.FC<ConsultationDetailHeaderProps> = ({ 
  consultation, 
  returnPath 
}) => {
  const { t } = useLanguage();
  
  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <span className="badge-pending">{t('pending')}</span>;
      case ConsultationStatus.IN_PROGRESS:
        return <span className="badge-in-progress">{t('inProgress')}</span>;
      case ConsultationStatus.COMPLETED:
        return <span className="badge-completed">{t('completed')}</span>;
    }
  };
  
  const diseaseName = consultation.disease 
    ? consultation.disease.name_en 
    : consultation.diseaseName || t('disease');

  return (
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
            <div>{getStatusBadge(consultation.status)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailHeader;
