
import React from "react";
import { Consultation, ConsultationStatus } from "@/types";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FileImage, MessageCircle } from "lucide-react";

interface ConsultationCardProps {
  consultation: Consultation;
  type: "patient" | "doctor";
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ consultation, type }) => {
  const { id, disease, status, createdAt, description, images, comments, voiceMemo } = consultation;
  
  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <span className="badge-pending">Pending</span>;
      case ConsultationStatus.IN_PROGRESS:
        return <span className="badge-in-progress">In Progress</span>;
      case ConsultationStatus.COMPLETED:
        return <span className="badge-completed">Completed</span>;
    }
  };

  const formattedDate = format(new Date(createdAt), "MMM d, yyyy, h:mm a");
  const diseaseName = disease ? disease.name_en : consultation.diseaseName || "Unknown Disease";
  const hasAttachments = (images && images.length > 0) || voiceMemo;
  const commentCount = comments?.length || 0;

  return (
    <Link
      to={`${type === "patient" ? "/consultations" : "/doctor/consultations"}/${id}`}
      className="block"
    >
      <div className="bg-white rounded-lg shadow p-5 mb-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{diseaseName}</h3>
          <div>{getStatusBadge(status)}</div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{formattedDate}</div>
          <div className="flex items-center space-x-3">
            {hasAttachments && (
              <div className="flex items-center text-gray-500">
                <FileImage size={16} className="mr-1" />
                <span className="text-xs">{images?.length || 0}</span>
              </div>
            )}
            {commentCount > 0 && (
              <div className="flex items-center text-gray-500">
                <MessageCircle size={16} className="mr-1" />
                <span className="text-xs">{commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ConsultationCard;
