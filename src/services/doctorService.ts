
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  full_name: string;
}

interface Patient {
  id: string;
  full_name: string;
}

export const doctorService = {
  async fetchDoctors(): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "doctor")
        .eq("is_approved", true);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
  },

  async fetchPatientById(id: string): Promise<Patient | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Error fetching patient:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
  }
};
