
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
  
  const usersWithDetails = profiles.map((profile) => ({
    ...profile,
  }));
  
  console.log("Processed users:", usersWithDetails);
  
  return usersWithDetails as User[];
}

export async function blockUser(userId: string, isBlocking: boolean) {
  console.log(`${isBlocking ? 'Blocking' : 'Unblocking'} user: ${userId}`);
  
  const { error } = await supabase
    .from("profiles")
    .update({ is_blocked: isBlocking })
    .eq("id", userId);
    
  if (error) {
    console.error(`Error ${isBlocking ? 'blocking' : 'unblocking'} user:`, error);
    throw error;
  }
  
  return true;
}
