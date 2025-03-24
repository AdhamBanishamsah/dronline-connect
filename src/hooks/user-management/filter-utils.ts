
import { User } from "./types";

export function filterUsersBySearchAndRole(
  users: User[], 
  searchQuery: string, 
  roleFilter: string | null
): User[] {
  if (!users.length) return [];
  
  let filtered = [...users];
  
  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(user => 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply role filter
  if (roleFilter !== null) {
    filtered = filtered.filter(user => user.role === roleFilter);
  }
  
  return filtered;
}
