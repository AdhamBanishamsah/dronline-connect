
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      {/* Empty admin portal as requested */}
    </div>
  );
};

export default AdminDashboard;
