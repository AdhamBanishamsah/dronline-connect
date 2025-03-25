
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConsultationNotFoundProps {
  userType?: 'doctor' | 'patient' | 'admin';
}

const ConsultationNotFound: React.FC<ConsultationNotFoundProps> = ({ userType = 'doctor' }) => {
  const getBackLink = () => {
    switch (userType) {
      case 'patient':
        return '/consultations';
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
      default:
        return '/doctor/consultations';
    }
  };

  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm p-8 my-6">
      <div className="flex justify-center mb-4">
        <AlertTriangle size={48} className="text-yellow-500" />
      </div>
      <h2 className="text-xl font-medium mb-2">Consultation not found</h2>
      <p className="text-gray-600 mb-6">
        The consultation you're looking for doesn't exist or you don't have access to it.
      </p>
      <Link to={getBackLink()}>
        <Button variant="outline" className="border-medical-primary text-medical-primary hover:bg-medical-secondary">
          Back to Consultations
        </Button>
      </Link>
    </div>
  );
};

export default ConsultationNotFound;
