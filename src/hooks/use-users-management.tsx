
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked?: boolean;
  email?: string;
  specialty?: string;
  is_approved?: boolean;
}

type BlockAction = "block" | "unblock" | null;

interface ConfirmDialogState {
  isOpen: boolean;
  userId: string | null;
  action: BlockAction;
}

export function useUsersManagement(initialRoleFilter: string | null = null) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(initialRoleFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
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
      console.log("Fetching all users...");
      
      // Using a simpler query without additional filters to get all profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
        
      if (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error fetching users",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      // Log fetched data for debugging
      console.log("Fetched profiles:", data);
      
      if (!data || data.length === 0) {
        console.warn("No profiles found in the database");
        setUsers([]);
        setFilteredUsers([]);
        return;
      }
      
      // Transform data to include is_blocked property for UI functionality
      const usersWithDetails = data.map((profile) => ({
        ...profile,
        is_blocked: profile.is_blocked || false, // Use existing property or default to false
      }));
      
      console.log("Processed users:", usersWithDetails);
      
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
    fetchUsers
  };
}

export type { User, BlockAction };
