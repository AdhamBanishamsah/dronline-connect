
import React, { useState, useEffect } from "react";
import { Consultation, ConsultationStatus } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, UserPlus, UserX } from "lucide-react";
import { format } from "date-fns";
import { doctorService } from "@/services/doctorService";

interface Doctor {
  id: string;
  full_name: string;
}

interface ConsultationTableProps {
  consultations: Consultation[];
  doctors: Doctor[];
  onViewDetails: (id: string) => void;
  onEditConsultation: (consultation: Consultation) => void;
  isLoading: boolean;
}

const ConsultationTable: React.FC<ConsultationTableProps> = ({
  consultations,
  doctors,
  onViewDetails,
  onEditConsultation,
  isLoading,
}) => {
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchPatientNames = async () => {
      const patientIds = [...new Set(consultations.map(c => c.patientId))];
      const names: Record<string, string> = {};
      
      for (const id of patientIds) {
        const patient = await doctorService.fetchPatientById(id);
        names[id] = patient ? patient.full_name : "Unknown Patient";
      }
      
      setPatientNames(names);
    };
    
    if (consultations.length > 0) {
      fetchPatientNames();
    }
  }, [consultations]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case ConsultationStatus.IN_PROGRESS:
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getDoctorName = (doctorId: string | null) => {
    if (!doctorId) return "Not assigned";
    
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.full_name : "Unknown";
  };

  const getPatientName = (patientId: string) => {
    return patientNames[patientId] || "Loading...";
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading consultations...</p>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
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
            <TableHead>Disease</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow key={consultation.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{consultation.disease}</TableCell>
              <TableCell>{getPatientName(consultation.patientId)}</TableCell>
              <TableCell>
                {consultation.doctorId ? (
                  <span className="flex items-center">
                    <UserPlus size={16} className="mr-1 text-green-600" />
                    {getDoctorName(consultation.doctorId)}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserX size={16} className="mr-1 text-gray-400" />
                    Not assigned
                  </span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(consultation.status)}</TableCell>
              <TableCell>{format(new Date(consultation.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={() => onViewDetails(consultation.id)}
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-medical-primary text-medical-primary hover:bg-blue-50"
                    onClick={() => onEditConsultation(consultation)}
                  >
                    <Pencil size={16} className="mr-1" />
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConsultationTable;
