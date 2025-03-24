
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  onAddNewUser?: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  onAddNewUser,
}) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search users by name..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={roleFilter === null ? "default" : "outline"}
          onClick={() => setRoleFilter(null)}
          className={roleFilter === null ? "bg-teal-500 hover:bg-teal-600" : ""}
          size="sm"
        >
          All Users
        </Button>
        <Button
          variant={roleFilter === "patient" ? "default" : "outline"}
          onClick={() => setRoleFilter("patient")}
          className={roleFilter === "patient" ? "bg-blue-500 hover:bg-blue-600" : ""}
          size="sm"
        >
          Patients
        </Button>
        <Button
          variant={roleFilter === "doctor" ? "default" : "outline"}
          onClick={() => setRoleFilter("doctor")}
          className={roleFilter === "doctor" ? "bg-green-500 hover:bg-green-600" : ""}
          size="sm"
        >
          Doctors
        </Button>
        <Button
          variant={roleFilter === "admin" ? "default" : "outline"}
          onClick={() => setRoleFilter("admin")}
          className={roleFilter === "admin" ? "bg-purple-500 hover:bg-purple-600" : ""}
          size="sm"
        >
          Admins
        </Button>
        {onAddNewUser && (
          <Button 
            variant="outline" 
            className="ml-2 border-green-500 text-green-600 hover:bg-green-50"
            onClick={onAddNewUser}
            size="sm"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
