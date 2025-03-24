
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/hooks/user-management/types";
import { fetchTestUsers, createTestUsers, deleteTestUser } from "@/services/test-users-service";
import TestUserList from "@/pages/test-users/TestUserList";
import TestUsersActions from "@/pages/test-users/TestUsersActions";

const TestUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
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
      
      await createTestUsers();
      
      toast({
        title: "Test users created",
        description: "Four test users have been added to the database",
      });
      
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

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsDeletingUser(true);
      
      await deleteTestUser(userId);
      
      toast({
        title: "User deleted",
        description: "The test user has been removed from the database",
      });
      
      fetchUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Error deleting user",
        description: err.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDeletingUser(false);
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
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default TestUsersPage;
