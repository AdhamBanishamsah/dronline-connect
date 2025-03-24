
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface TestUsersActionsProps {
  onAddTestUsers: () => void;
  isAddingUser: boolean;
}

const TestUsersActions: React.FC<TestUsersActionsProps> = ({ 
  onAddTestUsers, 
  isAddingUser 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Test User List</h1>
      <Button 
        onClick={onAddTestUsers} 
        disabled={isAddingUser}
        className="flex items-center gap-2"
      >
        <UserPlus size={18} />
        <span>{isAddingUser ? "Adding Users..." : "Add Test Users"}</span>
      </Button>
    </div>
  );
};

export default TestUsersActions;
