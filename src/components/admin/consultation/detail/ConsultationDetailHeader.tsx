
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface ConsultationDetailHeaderProps {
  onEditClick: () => void;
}

const ConsultationDetailHeader: React.FC<ConsultationDetailHeaderProps> = ({ 
  onEditClick 
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <Link to="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>
      <Button
        variant="outline"
        onClick={onEditClick}
        className="border-medical-primary text-medical-primary hover:bg-blue-50"
      >
        <Edit size={16} className="mr-2" />
        Edit Consultation
      </Button>
    </div>
  );
};

export default ConsultationDetailHeader;
