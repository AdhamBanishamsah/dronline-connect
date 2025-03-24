
export interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  isApproved: boolean;
  createdAt?: string;
}

// Interface for Supabase doctor data format
export interface SupabaseDoctor {
  id: string;
  full_name: string;
  specialty?: string;
  is_approved: boolean;
}

// Conversion function to transform Supabase data format to our app format
export const mapSupabaseDoctorToDoctor = (doctor: SupabaseDoctor): Doctor => ({
  id: doctor.id,
  fullName: doctor.full_name,
  specialty: doctor.specialty || "Not specified",
  isApproved: doctor.is_approved,
  createdAt: new Date().toISOString() // Use current date as fallback
});
