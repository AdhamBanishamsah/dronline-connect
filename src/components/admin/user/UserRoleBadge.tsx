
import React from "react";
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: string;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  return (
    <Badge className={
      role === "doctor" 
        ? "bg-green-100 text-green-800 hover:bg-green-100" 
        : role === "patient"
        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
        : "bg-purple-100 text-purple-800 hover:bg-purple-100"
    }>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};

export default UserRoleBadge;
