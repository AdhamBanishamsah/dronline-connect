
import React from "react";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck } from "lucide-react";
import { User } from "@/hooks/use-users-management";

interface BlockUserSectionProps {
  user: User;
  isLoading?: boolean;
  onToggleBlock: (userId: string, currentBlockedStatus: boolean) => void;
}

const BlockUserSection: React.FC<BlockUserSectionProps> = ({ 
  user, 
  isLoading = false, 
  onToggleBlock 
}) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className={
        user.is_blocked
          ? "border-green-500 text-green-500 hover:bg-green-50"
          : "border-red-500 text-red-500 hover:bg-red-50"
      }
      onClick={() => onToggleBlock(user.id, !!user.is_blocked)}
      disabled={isLoading}
    >
      {user.is_blocked ? (
        <>
          <UserCheck size={16} className="mr-1" />
          Unblock
        </>
      ) : (
        <>
          <Ban size={16} className="mr-1" />
          Block
        </>
      )}
    </Button>
  );
};

export default BlockUserSection;
