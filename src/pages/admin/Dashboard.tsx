
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import DashboardTabs from "@/components/admin/dashboard/DashboardTabs";

interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked: boolean;
  specialty?: string;
  is_approved?: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

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

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
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
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Specialty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
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
      )}
    </div>
  );
};

export default AdminDashboard;
