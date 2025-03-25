
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
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
  }
};
