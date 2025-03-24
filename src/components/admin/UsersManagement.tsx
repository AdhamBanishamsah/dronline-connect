
import React, { useEffect } from "react";
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

  useEffect(() => {
    console.log("UsersManagement mounted, users count:", users.length);
    return () => {
      console.log("UsersManagement unmounted");
    };
  }, [users.length]);

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
        <>
          {users.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {roleFilter ? `No ${roleFilter}s found. Try adjusting your filters.` : "No users found. Please check your database or refresh."}
              </p>
              <button 
                onClick={() => fetchUsers()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Users
              </button>
            </div>
          ) : (
            <UsersList 
              users={users} 
              onToggleBlock={handleToggleBlockUser}
              onUserUpdate={fetchUsers}
            />
          )}
        </>
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
