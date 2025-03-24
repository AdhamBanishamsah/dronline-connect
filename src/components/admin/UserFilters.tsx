
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search users by name or email..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <Button
          variant={roleFilter === null ? "default" : "outline"}
          onClick={() => setRoleFilter(null)}
          className={roleFilter === null ? "bg-medical-primary hover:opacity-90" : ""}
        >
          All Users
        </Button>
        <Button
          variant={roleFilter === "patient" ? "default" : "outline"}
          onClick={() => setRoleFilter("patient")}
          className={roleFilter === "patient" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Patients
        </Button>
        <Button
          variant={roleFilter === "doctor" ? "default" : "outline"}
          onClick={() => setRoleFilter("doctor")}
          className={roleFilter === "doctor" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Doctors
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
