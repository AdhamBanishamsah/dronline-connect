
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { ConsultationStatus, Consultation } from "@/types";
import ConsultationCard from "@/components/ConsultationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const DoctorConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const { getConsultationsByUserId, isLoading } = useConsultations();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const loadConsultations = async () => {
      if (!user) return;
      
      try {
        setFetchLoading(true);
        const userConsultations = await getConsultationsByUserId(user.id, user.role);
        setConsultations(userConsultations || []);
      } catch (error) {
        console.error("Error loading consultations:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    
    loadConsultations();
  }, [user, getConsultationsByUserId]);

  if (!user) return null;

  // Filter consultations based on search query and status
  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch = consultation.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         consultation.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Special handling based on status filter
    if (statusFilter === "all") {
      return matchesSearch;
    } else if (statusFilter === ConsultationStatus.PENDING) {
      // Available consultations = pending AND not assigned to any doctor
      return matchesSearch && consultation.status === ConsultationStatus.PENDING && !consultation.doctorId;
    } else if (statusFilter === ConsultationStatus.IN_PROGRESS) {
      // My cases = in progress AND assigned to current doctor
      return matchesSearch && 
             consultation.status === ConsultationStatus.IN_PROGRESS && 
             consultation.doctorId === user.id;
    } else {
      // Completed = completed AND assigned to current doctor
      return matchesSearch && 
             consultation.status === ConsultationStatus.COMPLETED &&
             consultation.doctorId === user.id;
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Available Consultations</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search consultations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "bg-medical-primary hover:opacity-90" : ""}
            >
              All Statuses
            </Button>
            <Button
              variant={statusFilter === ConsultationStatus.PENDING ? "default" : "outline"}
              onClick={() => setStatusFilter(ConsultationStatus.PENDING)}
              className={statusFilter === ConsultationStatus.PENDING ? "bg-medical-pending hover:opacity-90" : ""}
            >
              Available
            </Button>
            <Button
              variant={statusFilter === ConsultationStatus.IN_PROGRESS ? "default" : "outline"}
              onClick={() => setStatusFilter(ConsultationStatus.IN_PROGRESS)}
              className={statusFilter === ConsultationStatus.IN_PROGRESS ? "bg-medical-inprogress hover:opacity-90" : ""}
            >
              My Cases
            </Button>
            <Button
              variant={statusFilter === ConsultationStatus.COMPLETED ? "default" : "outline"}
              onClick={() => setStatusFilter(ConsultationStatus.COMPLETED)}
              className={statusFilter === ConsultationStatus.COMPLETED ? "bg-medical-completed hover:opacity-90" : ""}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      {isLoading || fetchLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading consultations...</p>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "There are no consultations available at the moment"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <ConsultationCard 
              key={consultation.id} 
              consultation={consultation}
              type="doctor"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorConsultationsPage;
