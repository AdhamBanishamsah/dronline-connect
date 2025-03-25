
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { Consultation, ConsultationStatus } from "@/types";
import ConsultationCard from "@/components/ConsultationCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DoctorConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const { consultations: allConsultations, getConsultationsByUserId, isLoading } = useConsultations();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;
      try {
        const data = await getConsultationsByUserId(user.id, user.role);
        setConsultations(data);
        console.log("Doctor consultations:", data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        toast({
          title: "Error",
          description: "Failed to load consultations",
          variant: "destructive",
        });
      }
    };
    
    fetchConsultations();
  }, [user, getConsultationsByUserId, toast]);

  const filterConsultations = (consultations: Consultation[]) => {
    return consultations.filter((consultation) => {
      const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
      
      const matchesSearch = searchQuery === "" || 
        consultation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (consultation.disease?.name_en.toLowerCase().includes(searchQuery.toLowerCase()));
      
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

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading consultations...</p>
        </div>
      ) : filteredConsultations.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredConsultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} type="doctor" />
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-500 mb-4">
            {statusFilter !== "all" 
              ? `No ${statusFilter} consultations match your search.` 
              : "There are no consultations available for you at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorConsultationsPage;
