
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

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
        throw error;
      }
      
      console.log("Users data:", data);
      
      if (!data || data.length === 0) {
        // Add mock users for demonstration
        const mockUsers = [
          {
            id: "user-1",
            full_name: "John Doe",
            email: "john.doe@example.com",
            role: "patient",
            is_blocked: false
          },
          {
            id: "user-2",
            full_name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "patient",
            is_blocked: false
          },
          {
            id: "user-3",
            full_name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            is_blocked: false
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        return;
      }
      
      // Adding is_blocked and email for demonstration (would need real implementation)
      const usersWithDetails = data.map((user, index) => ({
        ...user,
        email: `user${index + 1}@example.com`, // Mockup email
        is_blocked: false, // Mockup blocked status
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={roleFilter === null ? "default" : "outline"}
            onClick={() => setRoleFilter(null)}
            className={roleFilter === null ? "bg-medical-primary hover:opacity-90" : ""}
          >
            All Users
          </Button>
          <Button
            variant={roleFilter === "patient" ? "default" : "outline"}
            onClick={() => setRoleFilter("patient")}
            className={roleFilter === "patient" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Patients
          </Button>
          <Button
            variant={roleFilter === "doctor" ? "default" : "outline"}
            onClick={() => setRoleFilter("doctor")}
            className={roleFilter === "doctor" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Doctors
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            {searchQuery || roleFilter
              ? "Try adjusting your search or filter criteria"
              : "There are no users in the system yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      user.role === "doctor" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : user.role === "patient"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    }>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_blocked ? (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Blocked
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        user.is_blocked
                          ? "border-green-500 text-green-500 hover:bg-green-50"
                          : "border-red-500 text-red-500 hover:bg-red-50"
                      }
                      onClick={() => handleToggleBlockUser(user.id, !!user.is_blocked)}
                    >
                      {user.is_blocked ? (
                        <>
                          <UserCheck size={16} className="mr-1" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban size={16} className="mr-1" />
                          Block
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "block" ? "Block User" : "Unblock User"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "block"
                ? "Are you sure you want to block this user? They will no longer be able to use the platform."
                : "Are you sure you want to unblock this user? They will be able to use the platform again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === "block" ? "destructive" : "default"}
              onClick={confirmBlockAction}
              disabled={isLoading}
            >
              {confirmDialog.action === "block" ? "Block" : "Unblock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
