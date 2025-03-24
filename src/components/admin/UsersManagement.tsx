import React from "react";
import { useUsersManagement } from "@/hooks/use-users-management";
import UserFilters from "./UserFilters";
import UsersList from "./UsersList";
import UserLoadingState from "./UserLoadingState";
import BlockUserConfirmDialog from "./BlockUserConfirmDialog";
import AddUserDialog from "./AddUserDialog";

interface UsersManagementProps {
  initialRoleFilter?: string | null;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ initialRoleFilter = null }) => {
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
    addUserDialog,
    handleOpenAddUserDialog,
    handleCloseAddUserDialog,
    handleUserAdded,
    fetchUsers
  } = useUsersManagement(initialRoleFilter);

  return (
    <div className="space-y-4">
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onAddNewUser={handleOpenAddUserDialog}
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

      <AddUserDialog
        isOpen={addUserDialog}
        onClose={handleCloseAddUserDialog}
        onSuccess={handleUserAdded}
      />
    </div>
  );
};

export default UsersManagement;
