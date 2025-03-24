
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked: boolean;
  specialty?: string;
  is_approved?: boolean;
}

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
      
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");
        
      if (error) {
        throw error;
      }
      
      console.log("Fetched profiles:", profiles);
      setUsers(profiles || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "patient":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const createTestUsers = async () => {
    try {
      setIsAddingUser(true);
      
      // Use the special insert mode to create profiles directly
      // (This is for testing purposes only)
      
      // Create a doctor test user
      await supabase.from("profiles").upsert([
        {
          id: crypto.randomUUID(),
          full_name: "Dr. John Smith",
          role: "doctor",
          specialty: "Cardiology",
          is_approved: true,
          is_blocked: false
        }
      ], { onConflict: 'id' });
      
      // Create a patient test user
      await supabase.from("profiles").upsert([
        {
          id: crypto.randomUUID(),
          full_name: "Sarah Johnson",
          role: "patient",
          is_approved: true,
          is_blocked: false
        }
      ], { onConflict: 'id' });
      
      // Create a blocked user
      await supabase.from("profiles").upsert([
        {
          id: crypto.randomUUID(),
          full_name: "Alex Blocked",
          role: "patient",
          is_approved: true,
          is_blocked: true
        }
      ], { onConflict: 'id' });
      
      // Create a pending doctor
      await supabase.from("profiles").upsert([
        {
          id: crypto.randomUUID(),
          full_name: "Dr. Maria Pending",
          role: "doctor",
          specialty: "Dermatology",
          is_approved: false,
          is_blocked: false
        }
      ], { onConflict: 'id' });
      
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Test User List</h1>
        <Button 
          onClick={createTestUsers} 
          disabled={isAddingUser}
          className="flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>{isAddingUser ? "Adding Users..." : "Add Test Users"}</span>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found in the database.</p>
            <p className="text-gray-500 mt-2">Click the "Add Test Users" button to create sample users.</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Specialty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_blocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : user.role === "doctor" && user.is_approved === false ? (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Pending Approval
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.specialty || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default TestUsersPage;
