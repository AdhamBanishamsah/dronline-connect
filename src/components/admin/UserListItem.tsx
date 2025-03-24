
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  is_blocked?: boolean;
  specialty?: string;
  is_approved?: boolean;
}

interface UserListItemProps {
  user: User;
  onToggleBlock: (userId: string, currentBlockedStatus: boolean) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onToggleBlock }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleApproveDoctor = async () => {
    if (user.role !== "doctor") return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update the UI optimistically
      user.is_approved = true;
      
      toast({
        title: "Doctor approved",
        description: `${user.full_name} has been approved and can now use the platform.`,
      });
    } catch (error: any) {
      console.error("Error approving doctor:", error);
      toast({
        title: "Failed to approve doctor",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectDoctor = async () => {
    if (user.role !== "doctor") return;
    
    setIsLoading(true);
    try {
      // In a real app, you might want to delete the profile or mark it as rejected
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Doctor rejected",
        description: `${user.full_name}'s application has been rejected.`,
      });
      
      // We would need to refresh the list after this
      // This would be handled by the parent component
    } catch (error: any) {
      console.error("Error rejecting doctor:", error);
      toast({
        title: "Failed to reject doctor",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableRow key={user.id} className="hover:bg-gray-50">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{user.full_name}</span>
          {user.specialty && (
            <span className="text-sm text-gray-500">Specialty: {user.specialty}</span>
          )}
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
        ) : user.role === "doctor" && user.is_approved === false ? (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Approval
          </Badge>
        ) : (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          {/* Doctor approval actions */}
          {user.role === "doctor" && user.is_approved === false && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-50"
                onClick={handleApproveDoctor}
                disabled={isLoading}
              >
                <Check size={16} className="mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleRejectDoctor}
                disabled={isLoading}
              >
                <X size={16} className="mr-1" />
                Reject
              </Button>
            </>
          )}
          
          {/* Block/Unblock actions */}
          <Button
            size="sm"
            variant="outline"
            className={
              user.is_blocked
                ? "border-green-500 text-green-500 hover:bg-green-50"
                : "border-red-500 text-red-500 hover:bg-red-50"
            }
            onClick={() => onToggleBlock(user.id, !!user.is_blocked)}
            disabled={isLoading}
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
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserListItem;
