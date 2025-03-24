
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserFilters from "./UserFilters";
import UsersList from "./UsersList";
import UserLoadingState from "./UserLoadingState";
import BlockUserConfirmDialog from "./BlockUserConfirmDialog";

interface User {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  is_blocked?: boolean;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
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
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role");
        
      if (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error fetching users",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Users data:", data);
      
      // In a real implementation, you would:
      // 1. Query a 'blocked_users' table to get blocked status
      // 2. Join with auth.users to get emails (with admin access)
      
      // For now, we're adding mock emails and blocked status for display
      const usersWithDetails = data?.map((user, index) => ({
        ...user,
        email: `${user.full_name.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Generate email from name
        is_blocked: false, // Default to not blocked
      })) || [];
      
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
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
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

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default UsersManagement;
