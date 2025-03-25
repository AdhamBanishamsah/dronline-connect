
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import DashboardTabs from "@/components/admin/dashboard/DashboardTabs";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default AdminDashboard;
