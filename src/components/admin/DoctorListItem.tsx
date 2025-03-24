
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DoctorApprovalActions from "./DoctorApprovalActions";
import { SupabaseDoctor } from "./DoctorTypes";

interface DoctorListItemProps {
  doctor: SupabaseDoctor;
  onApprove: (doctorId: string) => void;
  onReject: (doctorId: string) => void;
  isLoading: boolean;
}

const DoctorListItem: React.FC<DoctorListItemProps> = ({
  doctor,
  onApprove,
  onReject,
  isLoading,
}) => {
  return (
    <TableRow key={doctor.id} className="hover:bg-gray-50">
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{doctor.full_name}</span>
        </div>
      </TableCell>
      <TableCell>
        {doctor.specialty || "Not specified"}
      </TableCell>
      <TableCell>
        {doctor.is_approved ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        ) : (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Approval
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DoctorApprovalActions
          doctorId={doctor.id}
          isApproved={doctor.is_approved}
          onApprove={onApprove}
          onReject={onReject}
          isLoading={isLoading}
        />
      </TableCell>
    </TableRow>
  );
};

export default DoctorListItem;
