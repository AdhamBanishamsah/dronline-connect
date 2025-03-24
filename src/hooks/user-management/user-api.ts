
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export async function fetchAllUsers() {
  console.log("Fetching all users...");
  
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*");
    
  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
  
  console.log("Fetched profiles:", profiles);
  
  if (!profiles || profiles.length === 0) {
    console.warn("No profiles found in the database");
    return [];
  }
  
  // Transform data to include is_blocked property for UI functionality
  // Since is_blocked doesn't exist in the schema, we'll maintain it in our local state only
  const usersWithDetails = profiles.map((profile) => ({
    ...profile,
    is_blocked: false, // Default all users to not blocked since we don't have this field in DB yet
  }));
  
  console.log("Processed users:", usersWithDetails);
  
  return usersWithDetails as User[];
}

export async function blockUser(userId: string, isBlocking: boolean) {
  // In a real implementation, you would update a blocked status field
  // For now, we're just simulating this in the front-end
  console.log(`${isBlocking ? 'Blocking' : 'Unblocking'} user: ${userId}`);
  return true;
}
