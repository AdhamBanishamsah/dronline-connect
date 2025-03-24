import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { User } from "@/hooks/user-management";
import UserRoleBadge from "./user/UserRoleBadge";
import UserStatusBadge from "./user/UserStatusBadge";
import DoctorApprovalSection from "./user/DoctorApprovalSection";
import BlockUserSection from "./user/BlockUserSection";

interface UserListItemProps {
  user: User;
  onToggleBlock: (userId: string, currentBlockedStatus: boolean) => void;
  onUserUpdate?: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ 
  user, 
  onToggleBlock,
  onUserUpdate = () => {} 
}) => {
  return (
    <TableRow key={user.id} className="hover:bg-gray-50">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{user.full_name}</span>
          {user.specialty && (
            <span className="text-sm text-gray-500">Specialty: {user.specialty}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <UserRoleBadge role={user.role} />
      </TableCell>
      <TableCell>
        <UserStatusBadge user={user} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          {/* Doctor approval actions */}
          <DoctorApprovalSection 
            user={user} 
            onSuccess={onUserUpdate}
          />
          
          {/* Block/Unblock actions */}
          <BlockUserSection
            user={user}
            onToggleBlock={onToggleBlock}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserListItem;
