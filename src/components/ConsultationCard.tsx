
import React from "react";
import { Consultation, ConsultationStatus } from "@/types";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ConsultationCardProps {
  consultation: Consultation;
  type: "patient" | "doctor";
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ consultation, type }) => {
  const { id, disease, status, createdAt, description } = consultation;
  
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

  return (
    <Link
      to={`${type === "patient" ? "/consultations" : "/doctor/consultations"}/${id}`}
      className="block"
    >
      <div className="bg-white rounded-lg shadow p-5 mb-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{disease}</h3>
          <div>{getStatusBadge(status)}</div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </div>
    </Link>
  );
};

export default ConsultationCard;
