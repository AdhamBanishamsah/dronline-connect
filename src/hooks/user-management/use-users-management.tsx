
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, BlockAction, ConfirmDialogState } from "./types";
import { fetchAllUsers, blockUser } from "./user-api";
import { filterUsersBySearchAndRole } from "./filter-utils";

export function useUsersManagement(initialRoleFilter: string | null = null) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(initialRoleFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    userId: null,
    action: null,
  });
  const [addUserDialog, setAddUserDialog] = useState(false);
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    console.log("useUsersManagement hook initialized with role filter:", initialRoleFilter);
    loadUsers();
  }, []);

  // Apply filters when searchQuery or roleFilter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, roleFilter, users]);

  const loadUsers = async () => {
    try {
      console.log("Loading users in useUsersManagement hook...");
      setIsLoading(true);
      const loadedUsers = await fetchAllUsers();
      console.log("Users loaded in hook:", loadedUsers);
      setUsers(loadedUsers);
    } catch (error: any) {
      console.error("Error fetching users in hook:", error);
      toast({
        title: "Error fetching users",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!users || users.length === 0) {
      console.log("No users to filter");
      setFilteredUsers([]);
      return;
    }
    
    console.log("Applying filters to", users.length, "users with role filter:", roleFilter);
    const filtered = filterUsersBySearchAndRole(users, searchQuery, roleFilter);
    console.log("Filtered users:", filtered.length, "from original:", users.length);
    setFilteredUsers(filtered);
  };

  const handleToggleBlockUser = (userId: string, currentBlockedStatus: boolean) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      action: currentBlockedStatus ? "unblock" : "block",
    });
  };

  const confirmBlockAction = async () => {
    if (!confirmDialog.userId || !confirmDialog.action) return;
    
    try {
      setIsLoading(true);
      
      // Call the API to block/unblock the user in the database
      await blockUser(confirmDialog.userId, confirmDialog.action === "block");
      
      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === confirmDialog.userId 
            ? { ...user, is_blocked: confirmDialog.action === "block" } 
            : user
        )
      );
      
      toast({
        title: confirmDialog.action === "block" ? "User blocked" : "User unblocked",
        description: confirmDialog.action === "block" 
          ? "The user has been blocked from the platform" 
          : "The user has been unblocked and can use the platform again",
      });
    } catch (error: any) {
      console.error(`Failed to ${confirmDialog.action} user:`, error);
      toast({
        title: "Action failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Close the dialog
      setConfirmDialog({
        isOpen: false,
        userId: null,
        action: null,
      });
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenAddUserDialog = () => {
    setAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setAddUserDialog(false);
  };

  const handleUserAdded = () => {
    // Refresh the users list after a new user is added
    loadUsers();
  };

  return {
    users: filteredUsers,
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
    fetchUsers: loadUsers
  };
}

export type { User, BlockAction };
