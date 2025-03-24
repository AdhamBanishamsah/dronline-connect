
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DoctorPageFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  approvalFilter: string | null;
  setApprovalFilter: (filter: string | null) => void;
}

const DoctorPageFilters: React.FC<DoctorPageFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  approvalFilter,
  setApprovalFilter,
}) => {
  return (
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
  );
};

export default DoctorPageFilters;
