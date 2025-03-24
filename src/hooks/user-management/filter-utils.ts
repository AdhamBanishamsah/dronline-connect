
import { User } from "./types";

export function filterUsersBySearchAndRole(
  users: User[], 
  searchQuery: string, 
  roleFilter: string | null
): User[] {
  if (!users || !users.length) {
    console.log("No users to filter");
    return [];
  }
  
  console.log("Filtering users:", users.length, "with search:", searchQuery, "and role filter:", roleFilter);
  
  let filtered = [...users];
  
  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(user => 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("After search filter:", filtered.length);
  }
  
  // Apply role filter
  if (roleFilter) {
    filtered = filtered.filter(user => user.role === roleFilter);
    console.log("After role filter:", filtered.length);
  }
  
  console.log("Final filtered users:", filtered);
  return filtered;
}
