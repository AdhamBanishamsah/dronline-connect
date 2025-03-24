
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DoctorFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  approvalFilter: string | null;
  setApprovalFilter: (filter: string | null) => void;
}

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  approvalFilter,
  setApprovalFilter,
}) => {
  return (
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
  );
};

export default DoctorFilters;
