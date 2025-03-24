
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserListItem from "./UserListItem";
import { User } from "@/hooks/use-users-management";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UsersListProps {
  users: User[];
  onToggleBlock: (userId: string, currentBlockedStatus: boolean) => void;
  onUserUpdate?: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, onToggleBlock, onUserUpdate }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                onToggleBlock={onToggleBlock}
                onUserUpdate={onUserUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default UsersList;
