
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/hooks/user-management/types";

export async function fetchTestUsers(): Promise<User[]> {
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*");
      
    if (error) {
      throw error;
    }
    
    console.log("Fetched profiles:", profiles);
    return profiles || [];
  } catch (err: any) {
    console.error("Error fetching users:", err);
    throw err;
  }
}

export async function createTestUsers(): Promise<void> {
  // Create a doctor test user
  await supabase.from("profiles").upsert([
    {
      id: crypto.randomUUID(),
      full_name: "Dr. John Smith",
      role: "doctor",
      specialty: "Cardiology",
      is_approved: true,
      is_blocked: false
    }
  ], { onConflict: 'id' });
  
  // Create a patient test user
  await supabase.from("profiles").upsert([
    {
      id: crypto.randomUUID(),
      full_name: "Sarah Johnson",
      role: "patient",
      is_approved: true,
      is_blocked: false
    }
  ], { onConflict: 'id' });
  
  // Create a blocked user
  await supabase.from("profiles").upsert([
    {
      id: crypto.randomUUID(),
      full_name: "Alex Blocked",
      role: "patient",
      is_approved: true,
      is_blocked: true
    }
  ], { onConflict: 'id' });
  
  // Create a pending doctor
  await supabase.from("profiles").upsert([
    {
      id: crypto.randomUUID(),
      full_name: "Dr. Maria Pending",
      role: "doctor",
      specialty: "Dermatology",
      is_approved: false,
      is_blocked: false
    }
  ], { onConflict: 'id' });
}
