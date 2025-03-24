
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserFilters from "./UserFilters";
import UsersList from "./UsersList";
import UserLoadingState from "./UserLoadingState";
import BlockUserConfirmDialog from "./BlockUserConfirmDialog";
import { UserRole } from "@/types";
import AddUserDialog from "./AddUserDialog";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked?: boolean;
  email?: string;
  specialty?: string;
  is_approved?: boolean;
}

interface UsersManagementProps {
  initialRoleFilter?: string | null;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ initialRoleFilter = null }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(initialRoleFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    action: "block" | "unblock" | null;
  }>({
    isOpen: false,
    userId: null,
    action: null,
  });
  const [addUserDialog, setAddUserDialog] = useState(false);
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters when searchQuery or roleFilter changes
  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching users...");
      
      // Get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
        
      if (profilesError) {
        console.error("Error fetching users:", profilesError);
        toast({
          title: "Error fetching users",
          description: profilesError.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      // Log fetched data for debugging
      console.log("Fetched profiles:", profilesData);
      
      if (!profilesData || profilesData.length === 0) {
        console.warn("No profiles found in the database");
        setUsers([]);
        setFilteredUsers([]);
        return;
      }
      
      // For now, we'll add a mock blocked status
      const usersWithDetails = profilesData.map((profile) => ({
        ...profile,
        is_blocked: false, // Default to not blocked
      }));
      
      setUsers(usersWithDetails);
      setFilteredUsers(usersWithDetails);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching users",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!users.length) return;
    
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply role filter
    if (roleFilter !== null) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
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
      
      // In a real implementation, you would update a blocked status field
      // For now, we'll just update the local state for demonstration
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
    } catch (error) {
      console.error(`Failed to ${confirmDialog.action} user:`, error);
      toast({
        title: "Action failed",
        description: "Please try again later",
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
    fetchUsers();
  };

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
          users={filteredUsers} 
          onToggleBlock={handleToggleBlockUser} 
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
