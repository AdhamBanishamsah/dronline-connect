
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DoctorListItem from "./DoctorListItem";
import { SupabaseDoctor } from "./DoctorTypes";

interface DoctorsListProps {
  doctors: SupabaseDoctor[];
  onApprove: (doctorId: string) => void;
  onReject: (doctorId: string) => void;
  isLoading: boolean;
}

const DoctorsList: React.FC<DoctorsListProps> = ({
  doctors,
  onApprove,
  onReject,
  isLoading,
}) => {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <DoctorListItem
              key={doctor.id}
              doctor={doctor}
              onApprove={onApprove}
              onReject={onReject}
              isLoading={isLoading}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorsList;
