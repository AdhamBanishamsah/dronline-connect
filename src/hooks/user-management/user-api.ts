
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export async function fetchAllUsers() {
  console.log("Fetching all users...");
  
  try {
    const { data: profiles, error, status } = await supabase
      .from("profiles")
      .select("*");
      
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    console.log(`Fetched ${profiles?.length || 0} profiles with status code ${status}:`, profiles);
    
    if (!profiles || profiles.length === 0) {
      console.warn("No profiles found in the database");
      return [];
    }
    
    // Ensure all required fields are mapped properly
    const usersWithDetails = profiles.map((profile) => ({
      id: profile.id,
      full_name: profile.full_name || 'Unknown',
      role: profile.role || 'patient',
      is_blocked: Boolean(profile.is_blocked),
      // The profiles table doesn't have an email field, so we'll skip it
      specialty: profile.specialty || undefined,
      is_approved: profile.is_approved !== undefined ? profile.is_approved : true
    }));
    
    console.log("Processed users:", usersWithDetails);
    
    return usersWithDetails as User[];
  } catch (error) {
    console.error("Unexpected error in fetchAllUsers:", error);
    throw error;
  }
}

export async function blockUser(userId: string, isBlocking: boolean) {
  console.log(`${isBlocking ? 'Blocking' : 'Unblocking'} user: ${userId}`);
  
  try {
    const { error, status } = await supabase
      .from("profiles")
      .update({ is_blocked: isBlocking })
      .eq("id", userId);
      
    if (error) {
      console.error(`Error ${isBlocking ? 'blocking' : 'unblocking'} user:`, error);
      throw error;
    }
    
    console.log(`User ${userId} ${isBlocking ? 'blocked' : 'unblocked'} successfully with status code ${status}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error in blockUser:`, error);
    throw error;
  }
}
