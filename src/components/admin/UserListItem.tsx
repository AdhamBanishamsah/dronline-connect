
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  is_blocked?: boolean;
}

interface UserListItemProps {
  user: User;
  onToggleBlock: (userId: string, currentBlockedStatus: boolean) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onToggleBlock }) => {
  return (
    <TableRow key={user.id} className="hover:bg-gray-50">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{user.full_name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={
          user.role === "doctor" 
            ? "bg-green-100 text-green-800 hover:bg-green-100" 
            : user.role === "patient"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
            : "bg-purple-100 text-purple-800 hover:bg-purple-100"
        }>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        {user.is_blocked ? (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Blocked
          </Badge>
        ) : (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="outline"
          className={
            user.is_blocked
              ? "border-green-500 text-green-500 hover:bg-green-50"
              : "border-red-500 text-red-500 hover:bg-red-50"
          }
          onClick={() => onToggleBlock(user.id, !!user.is_blocked)}
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
      </TableCell>
    </TableRow>
  );
};

export default UserListItem;
