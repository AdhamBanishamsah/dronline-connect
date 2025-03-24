
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DoctorApprovalActionsProps {
  doctorId: string;
  isApproved: boolean;
  onApprove: (doctorId: string) => void;
  onReject: (doctorId: string) => void;
  isLoading: boolean;
}

const DoctorApprovalActions: React.FC<DoctorApprovalActionsProps> = ({
  doctorId,
  isApproved,
  onApprove,
  onReject,
  isLoading,
}) => {
  if (isApproved) {
    return null;
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button
        size="sm"
        variant="outline"
        className="border-green-500 text-green-500 hover:bg-green-50"
        onClick={() => onApprove(doctorId)}
        disabled={isLoading}
      >
        <Check size={16} className="mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-red-500 text-red-500 hover:bg-red-50"
        onClick={() => onReject(doctorId)}
        disabled={isLoading}
      >
        <X size={16} className="mr-1" />
        Reject
      </Button>
    </div>
  );
};

export default DoctorApprovalActions;
