
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: string;
  full_name: string;
  email?: string;
  specialty?: string;
  is_approved: boolean;
  created_at?: string;
}

const DoctorsManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
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
      
      // Get all profiles with doctor role
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, specialty, is_approved")
        .eq("role", "doctor");
        
      if (error) throw error;
      
      // Fetch email addresses from auth.users
      // We'll need to fetch emails in a real implementation with admin access
      // For now, we'll use mockup emails
      
      const doctorsWithEmails = data.map((doctor, index) => ({
        ...doctor,
        email: `doctor${index + 1}@example.com`, // Mockup email
      }));
      
      setDoctors(doctorsWithEmails);
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
        
      if (error) throw error;
      
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
        
      if (error) throw error;
      
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
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search doctors by name, email, or specialty..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={approvalFilter === null ? "default" : "outline"}
            onClick={() => setApprovalFilter(null)}
            className={approvalFilter === null ? "bg-medical-primary hover:opacity-90" : ""}
          >
            All Doctors
          </Button>
          <Button
            variant={approvalFilter === "approved" ? "default" : "outline"}
            onClick={() => setApprovalFilter("approved")}
            className={approvalFilter === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Approved
          </Button>
          <Button
            variant={approvalFilter === "pending" ? "default" : "outline"}
            onClick={() => setApprovalFilter("pending")}
            className={approvalFilter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            Pending Approval
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500">
            {searchQuery || approvalFilter
              ? "Try adjusting your search or filter criteria"
              : "There are no doctors in the system yet"}
          </p>
        </div>
      ) : (
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
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{doctor.full_name}</span>
                      <span className="text-sm text-gray-500">{doctor.email}</span>
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
                    {!doctor.is_approved && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleApproveDoctor(doctor.id)}
                          disabled={isLoading}
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRejectDoctor(doctor.id)}
                          disabled={isLoading}
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;
