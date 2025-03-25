import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Consultation, ConsultationStatus } from "@/types";
import ConsultationCard from "@/components/ConsultationCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import mockConsultations from "@/data/mockConsultations";

interface ConsultationsPageProps {
  consultations?: Consultation[];
}

const DoctorConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | "all">("all");

  useEffect(() => {
    // In a real application, you would fetch consultations from an API
    // For now, we're using mock data
    setConsultations(mockConsultations.filter(consultation => consultation.doctor?.id === user?.id));
  }, [user?.id]);

  const filterConsultations = (consultations: Consultation[]) => {
    return consultations.filter((consultation) => {
      const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
      
      const matchesSearch = searchQuery === "" || 
        consultation.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (consultation.disease.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
        consultation.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  };

  const filteredConsultations = useMemo(() => {
    return filterConsultations(consultations);
  }, [consultations, statusFilter, searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Consultations</h1>

      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search consultations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ConsultationStatus | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ConsultationStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={ConsultationStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={ConsultationStatus.COMPLETED}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredConsultations.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredConsultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} type="doctor" />
          ))}
        </div>
      ) : (
        <div className="text-center">No consultations found.</div>
      )}
    </div>
  );
};

export default DoctorConsultationsPage;
