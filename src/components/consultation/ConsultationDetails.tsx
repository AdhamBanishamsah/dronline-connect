
import React from "react";
import { Consultation } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface ConsultationDetailsProps {
  consultation: Consultation;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({ consultation }) => {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('description')}</h3>
            <p className="mt-1">{consultation.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t('symptoms')}</h3>
            <p className="mt-1">{consultation.symptoms}</p>
          </div>
          
          {consultation.images && consultation.images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t('uploadedImages')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {consultation.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`${t('medicalImage')} ${index + 1}`} 
                    className="rounded-md h-32 w-full object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          
          {consultation.voiceMemo && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t('voiceMemo')}</h3>
              <audio controls src={consultation.voiceMemo} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetails;
