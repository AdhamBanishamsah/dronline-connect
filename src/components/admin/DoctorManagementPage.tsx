
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Doctor } from "./DoctorTypes";
import { MOCK_DOCTORS } from "./MockDoctors";
import DoctorPageFilters from "./DoctorPageFilters";
import DoctorTableView from "./DoctorTableView";

const DoctorManagementPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filter doctors based on search query and approval status
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesApproval = approvalFilter === null || 
                          (approvalFilter === "approved" && doctor.isApproved) ||
                          (approvalFilter === "pending" && !doctor.isApproved);
    
    return matchesSearch && matchesApproval;
  });

  const handleApproveDoctor = async (doctorId: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the local state
      setDoctors(prev =>
        prev.map(doctor =>
          doctor.id === doctorId ? { ...doctor, isApproved: true } : doctor
        )
      );
      
      toast({
        title: "Doctor approved",
        description: "The doctor's account has been approved successfully."
      });
    } catch (error) {
      console.error("Failed to approve doctor:", error);
      toast({
        title: "Failed to approve doctor",
        description: "An error occurred while approving the doctor.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectDoctor = async (doctorId: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from the list
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
      
      toast({
        title: "Doctor rejected",
        description: "The doctor has been removed from the platform."
      });
    } catch (error) {
      console.error("Failed to reject doctor:", error);
      toast({
        title: "Failed to reject doctor",
        description: "An error occurred while rejecting the doctor.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DoctorPageFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        approvalFilter={approvalFilter}
        setApprovalFilter={setApprovalFilter}
      />

      <DoctorTableView
        filteredDoctors={filteredDoctors}
        handleApproveDoctor={handleApproveDoctor}
        handleRejectDoctor={handleRejectDoctor}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DoctorManagementPage;
