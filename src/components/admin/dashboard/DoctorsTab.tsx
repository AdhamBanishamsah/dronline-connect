
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import DoctorsManagement from "@/components/admin/DoctorsManagement";

const DoctorsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Doctor Management
        </CardTitle>
        <CardDescription>Approve, reject and manage doctors on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <DoctorsManagement />
      </CardContent>
    </Card>
  );
};

export default DoctorsTab;
