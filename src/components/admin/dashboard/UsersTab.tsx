
import React from "react";
import { useUsersManagement } from "@/hooks/user-management";
import UserFilters from "@/components/admin/UserFilters";
import UsersList from "@/components/admin/UsersList";
import UserLoadingState from "@/components/admin/UserLoadingState";
import BlockUserConfirmDialog from "@/components/admin/BlockUserConfirmDialog";

const UsersTab: React.FC = () => {
  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    confirmDialog,
    closeConfirmDialog,
    confirmBlockAction,
    handleToggleBlockUser,
    fetchUsers
  } = useUsersManagement();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {isLoading ? (
        <UserLoadingState />
      ) : (
        <UsersList 
          users={users} 
          onToggleBlock={handleToggleBlockUser}
          onUserUpdate={fetchUsers}
        />
      )}

      <BlockUserConfirmDialog
        isOpen={confirmDialog.isOpen}
        action={confirmDialog.action}
        isLoading={isLoading}
        onClose={closeConfirmDialog}
        onConfirm={confirmBlockAction}
      />
    </div>
  );
};

export default UsersTab;
