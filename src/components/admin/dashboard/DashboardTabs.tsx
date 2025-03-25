
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, BarChart2 } from "lucide-react";
import UsersTab from "./UsersTab";
import ConsultationsTab from "./ConsultationsTab";
import ReportsTab from "./ReportsTab";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
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

      <TabsContent value="users" className="space-y-4 pt-4">
        <UsersTab />
      </TabsContent>

      <TabsContent value="consultations" className="space-y-4 pt-4">
        <ConsultationsTab />
      </TabsContent>

      <TabsContent value="reports" className="space-y-4 pt-4">
        <ReportsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
