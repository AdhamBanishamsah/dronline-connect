
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import DoctorManagementPage from "./DoctorManagementPage";

const AdminDoctorPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect if user is not an admin
  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Manage Doctors</h1>
      </div>
      
      <DoctorManagementPage />
    </div>
  );
};

export default AdminDoctorPage;
