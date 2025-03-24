
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ConsultationStatus } from "@/types";

interface ConsultationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

const ConsultationFilters: React.FC<ConsultationFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center justify-between">
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
          variant={statusFilter === null ? "default" : "outline"}
          onClick={() => setStatusFilter(null)}
          className={statusFilter === null ? "bg-medical-primary hover:opacity-90" : ""}
        >
          All Statuses
        </Button>
        <Button
          variant={statusFilter === ConsultationStatus.PENDING ? "default" : "outline"}
          onClick={() => setStatusFilter(ConsultationStatus.PENDING)}
          className={statusFilter === ConsultationStatus.PENDING ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === ConsultationStatus.IN_PROGRESS ? "default" : "outline"}
          onClick={() => setStatusFilter(ConsultationStatus.IN_PROGRESS)}
          className={statusFilter === ConsultationStatus.IN_PROGRESS ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          In Progress
        </Button>
        <Button
          variant={statusFilter === ConsultationStatus.COMPLETED ? "default" : "outline"}
          onClick={() => setStatusFilter(ConsultationStatus.COMPLETED)}
          className={statusFilter === ConsultationStatus.COMPLETED ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};

export default ConsultationFilters;
