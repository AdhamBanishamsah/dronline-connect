
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/hooks/user-management/types";
import { fetchTestUsers, createTestUsers } from "@/services/test-users-service";
import TestUserList from "@/pages/test-users/TestUserList";
import TestUsersActions from "@/pages/test-users/TestUsersActions";

const TestUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profiles = await fetchTestUsers();
      setUsers(profiles);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestUsers = async () => {
    try {
      setIsAddingUser(true);
      
      // Use the special insert mode to create profiles directly
      // (This is for testing purposes only)
      await createTestUsers();
      
      toast({
        title: "Test users created",
        description: "Four test users have been added to the database",
      });
      
      // Refresh the user list
      fetchUsers();
    } catch (err: any) {
      console.error("Error creating test users:", err);
      toast({
        title: "Error creating test users",
        description: err.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <TestUsersActions 
        onAddTestUsers={handleCreateTestUsers}
        isAddingUser={isAddingUser}
      />
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <TestUserList 
          users={users}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchUsers}
        />
      </div>
    </div>
  );
};

export default TestUsersPage;
