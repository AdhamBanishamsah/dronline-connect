
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ConsultationNotFound: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium mb-2">Consultation not found</h2>
      <p className="text-gray-600 mb-6">The consultation you're looking for doesn't exist or you don't have access to it.</p>
      <Link to="/doctor/consultations">
        <Button variant="outline">Back to Consultations</Button>
      </Link>
    </div>
  );
};

export default ConsultationNotFound;
