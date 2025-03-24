
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types";
import { Check, X } from "lucide-react";

// Mock doctor data for the admin dashboard
const MOCK_DOCTORS = [
  {
    id: "2",
    email: "doctor@example.com",
    fullName: "Dr. John Smith",
    specialty: "General Medicine",
    isApproved: true,
    createdAt: "2023-06-15T10:00:00Z",
  },
  {
    id: "4",
    email: "amira@example.com",
    fullName: "Dr. Amira Hassan",
    specialty: "Pediatrics",
    isApproved: false,
    createdAt: "2023-06-18T09:30:00Z",
  },
  {
    id: "5",
    email: "mohammed@example.com",
    fullName: "Dr. Mohammed Ali",
    specialty: "Cardiology",
    isApproved: false,
    createdAt: "2023-06-20T11:15:00Z",
  },
  {
    id: "6",
    email: "sarah@example.com",
    fullName: "Dr. Sarah Johnson",
    specialty: "Dermatology",
    isApproved: true,
    createdAt: "2023-06-10T14:20:00Z",
  },
];

interface Doctor {
  id: string;
  email: string;
  fullName: string;
  specialty: string;
  isApproved: boolean;
  createdAt: string;
}

const AdminDoctorsPage: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.role !== UserRole.ADMIN) return null;

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
    } catch (error) {
      console.error("Failed to approve doctor:", error);
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
    } catch (error) {
      console.error("Failed to reject doctor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Manage Doctors</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
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
              className={approvalFilter === "approved" ? "bg-medical-completed hover:opacity-90" : ""}
            >
              Approved
            </Button>
            <Button
              variant={approvalFilter === "pending" ? "default" : "outline"}
              onClick={() => setApprovalFilter("pending")}
              className={approvalFilter === "pending" ? "bg-medical-pending hover:opacity-90" : ""}
            >
              Pending Approval
            </Button>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
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
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.isApproved ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending Approval
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!doctor.isApproved && (
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsPage;
