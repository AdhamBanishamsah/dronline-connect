
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserFilters from "./UserFilters";
import UsersList from "./UsersList";
import UserLoadingState from "./UserLoadingState";
import BlockUserConfirmDialog from "./BlockUserConfirmDialog";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked?: boolean;
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
      
      // For now, we're adding mock blocked status for display
      const usersWithDetails = data?.map((user, index) => ({
        ...user,
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

  const addSampleUsers = async () => {
    try {
      setIsLoading(true);
      
      // Sample users to add
      const sampleUsers = [
        { id: crypto.randomUUID(), full_name: "John Doe", role: "patient" },
        { id: crypto.randomUUID(), full_name: "Jane Smith", role: "patient" },
        { id: crypto.randomUUID(), full_name: "Dr. Michael Johnson", role: "doctor", specialty: "Cardiology", is_approved: true },
        { id: crypto.randomUUID(), full_name: "Dr. Sarah Williams", role: "doctor", specialty: "Neurology", is_approved: true },
        { id: crypto.randomUUID(), full_name: "Dr. Robert Davis", role: "doctor", specialty: "Pediatrics", is_approved: false },
      ];
      
      // Insert sample users
      const { error } = await supabase
        .from("profiles")
        .insert(sampleUsers);
        
      if (error) {
        console.error("Error adding sample users:", error);
        toast({
          title: "Failed to add sample users",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Sample users added",
        description: "Sample doctors and patients have been added successfully",
      });
      
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Error adding sample users:", error);
      toast({
        title: "Failed to add sample users",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <UserFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
        
        <Button 
          onClick={addSampleUsers} 
          disabled={isLoading}
          className="ml-2 bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Sample Users
        </Button>
      </div>

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
