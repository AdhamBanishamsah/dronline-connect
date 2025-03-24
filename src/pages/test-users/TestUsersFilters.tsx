
import React from "react";
import UserFilters from "@/components/admin/UserFilters";

interface TestUsersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
}

const TestUsersFilters: React.FC<TestUsersFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter
}) => {
  return (
    <div className="mb-4">
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        // Omitting onAddNewUser since we have a separate "Add Test Users" button
      />
    </div>
  );
};

export default TestUsersFilters;
