
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { Users, FileText, BarChart2, Shield } from "lucide-react";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import ConsultationsManagement from "@/components/admin/ConsultationsManagement";
import ReportsView from "@/components/admin/ReportsView";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("doctors");

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="doctors" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Doctors</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="consultations" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Consultations</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="space-y-4 pt-4">
          <DoctorsManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4 pt-4">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4 pt-4">
          <ConsultationsManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 pt-4">
          <ReportsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
