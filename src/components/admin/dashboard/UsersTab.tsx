
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import UsersManagement from "@/components/admin/UsersManagement";

const UsersTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>View, filter, and manage all users on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <UsersManagement />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
