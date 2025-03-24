
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DoctorFilters from "./DoctorFilters";
import DoctorsList from "./DoctorsList";
import DoctorLoadingState from "./DoctorLoadingState";
import { SupabaseDoctor, mapSupabaseDoctorToDoctor } from "./DoctorTypes";

const DoctorsManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<SupabaseDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<SupabaseDoctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Apply filters when searchQuery or approvalFilter changes
  useEffect(() => {
    filterDoctors();
  }, [searchQuery, approvalFilter, doctors]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching doctors...");
      
      // Get all profiles with doctor role
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, specialty, is_approved, created_at")
        .eq("role", "doctor");
        
      if (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error fetching doctors",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Doctors data:", data);
      
      // Add email info (in a real app you would get these from auth.users)
      // Make sure data is an array before mapping and ensure each item is a valid object
      const doctorsWithEmails = Array.isArray(data) ? data.map((doctor, index) => {
        // Explicitly check if doctor is an object and has the required properties
        if (doctor && typeof doctor === 'object' && 'id' in doctor && 'full_name' in doctor) {
          // Create a new object instead of spreading to avoid type issues
          return {
            id: doctor.id,
            full_name: doctor.full_name,
            specialty: doctor.specialty || null,
            is_approved: typeof doctor.is_approved === 'boolean' ? doctor.is_approved : false,
            created_at: doctor.created_at || null,
            email: `doctor${index + 1}@example.com`, // Mockup email for display
          };
        }
        // Fallback for invalid doctor data
        return {
          id: `unknown-${index}`,
          full_name: 'Unknown Doctor',
          email: `unknown${index}@example.com`,
          is_approved: false,
          specialty: null,
          created_at: null
        };
      }) : [];
      
      setDoctors(doctorsWithEmails);
      setFilteredDoctors(doctorsWithEmails);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error fetching doctors",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    if (!doctors.length) return;
    
    let filtered = [...doctors];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor => 
        doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.email && doctor.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doctor.specialty && doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply approval filter
    if (approvalFilter !== null) {
      filtered = filtered.filter(doctor => 
        (approvalFilter === "approved" && doctor.is_approved) ||
        (approvalFilter === "pending" && !doctor.is_approved)
      );
    }
    
    setFilteredDoctors(filtered);
  };

  const handleApproveDoctor = async (doctorId: string) => {
    try {
      setIsLoading(true);
      
      // Update the doctor's approval status
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", doctorId);
        
      if (error) {
        console.error("Failed to approve doctor:", error);
        toast({
          title: "Approval failed",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setDoctors(prev =>
        prev.map(doctor =>
          doctor.id === doctorId ? { ...doctor, is_approved: true } : doctor
        )
      );
      
      toast({
        title: "Doctor approved",
        description: "The doctor can now use the platform",
      });
    } catch (error) {
      console.error("Failed to approve doctor:", error);
      toast({
        title: "Approval failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectDoctor = async (doctorId: string) => {
    try {
      setIsLoading(true);
      
      // Delete the doctor's profile and auth account
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", doctorId);
        
      if (error) {
        console.error("Failed to reject doctor:", error);
        toast({
          title: "Rejection failed",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      // Remove from the list
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
      
      toast({
        title: "Doctor rejected",
        description: "The doctor has been removed from the platform",
      });
    } catch (error) {
      console.error("Failed to reject doctor:", error);
      toast({
        title: "Rejection failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <DoctorFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        approvalFilter={approvalFilter}
        setApprovalFilter={setApprovalFilter}
      />

      {isLoading ? (
        <DoctorLoadingState />
      ) : (
        <DoctorsList
          doctors={filteredDoctors}
          onApprove={handleApproveDoctor}
          onReject={handleRejectDoctor}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default DoctorsManagement;
