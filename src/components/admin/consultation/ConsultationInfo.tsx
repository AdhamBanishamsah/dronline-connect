
import React, { useState, useEffect } from "react";
import { Consultation, ConsultationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { doctorService } from "@/services/doctorService";

interface Doctor {
  id: string;
  full_name: string;
}

interface ConsultationInfoProps {
  consultation: Consultation;
  doctors?: Doctor[];
}

const ConsultationInfo: React.FC<ConsultationInfoProps> = ({ consultation, doctors = [] }) => {
  const [patientName, setPatientName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchPatientName = async () => {
      const patient = await doctorService.fetchPatientById(consultation.patientId);
      if (patient) {
        setPatientName(patient.full_name);
      } else {
        setPatientName("Unknown Patient");
      }
    };

    fetchPatientName();
  }, [consultation.patientId]);

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case ConsultationStatus.IN_PROGRESS:
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDoctorName = () => {
    if (!consultation.doctorId) return "Not assigned";

    const doctor = doctors.find((d) => d.id === consultation.doctorId);
    return doctor ? doctor.full_name : "Unknown Doctor";
  };
  
  const diseaseName = consultation.disease ? consultation.disease.name_en : consultation.diseaseName || "Unknown Disease";

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{diseaseName}</h1>
          <div className="flex items-center space-x-2">
            {consultation.doctorId ? (
              <Badge className="bg-teal-100 text-teal-800">
                <UserPlus size={14} className="mr-1" />
                Assigned
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">
                <UserPlus size={14} className="mr-1" />
                Unassigned
              </Badge>
            )}
            {getStatusBadge(consultation.status)}
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Created {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient</h3>
              <p className="mt-1">{patientName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
              <p className="mt-1">{getDoctorName()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
              <p className="mt-1">{format(new Date(consultation.createdAt), "PPP p")}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{consultation.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Symptoms</h3>
              <p className="mt-1">{consultation.symptoms}</p>
            </div>
          </div>
        </div>

        {consultation.images && consultation.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {consultation.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Medical image ${index + 1}`}
                  className="rounded-md h-32 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {consultation.voiceMemo && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Voice Memo</h3>
            <audio controls src={consultation.voiceMemo} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationInfo;
