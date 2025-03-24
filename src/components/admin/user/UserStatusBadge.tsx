
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/hooks/use-users-management";

interface UserStatusBadgeProps {
  user: User;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ user }) => {
  if (user.is_blocked) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Blocked
      </Badge>
    );
  } 
  
  if (user.role === "doctor" && user.is_approved === false) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Pending Approval
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
      Active
    </Badge>
  );
};

export default UserStatusBadge;
