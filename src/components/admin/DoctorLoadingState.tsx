
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow, Table, TableBody, TableHeader } from "@/components/ui/table";

const DoctorLoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Specialty</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[70px] rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-[80px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorLoadingState;
