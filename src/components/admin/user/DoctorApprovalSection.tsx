
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { User } from "@/hooks/use-users-management";

interface DoctorApprovalSectionProps {
  user: User;
  onSuccess: () => void;
}

const DoctorApprovalSection: React.FC<DoctorApprovalSectionProps> = ({ user, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleApproveDoctor = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Doctor approved",
        description: `${user.full_name} has been approved and can now use the platform.`,
      });
      
      onSuccess();
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
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Doctor rejected",
        description: `${user.full_name}'s application has been rejected.`,
      });
      
      onSuccess();
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

  if (user.role !== "doctor" || user.is_approved !== false) {
    return null;
  }

  return (
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
  );
};

export default DoctorApprovalSection;
