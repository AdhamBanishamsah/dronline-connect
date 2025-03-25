
import React from "react";
import ConsultationsManagement from "@/components/admin/ConsultationsManagement";

const ConsultationsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Consultations</h2>
      <ConsultationsManagement />
    </div>
  );
};

export default ConsultationsTab;
