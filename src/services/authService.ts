
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new Error(error.message);
      
      if (!data.user) {
        throw new Error("User not found");
      }
      
      // Fetch user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      if (profileError) throw new Error(profileError.message);
      
      // Check if doctor is approved
      if (profileData.role === UserRole.DOCTOR && !profileData.is_approved) {
        throw new Error("Your account is pending approval. Please wait for administrator approval.");
      }
      
      // Create a User object from the profile data
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
        fullName: profileData.full_name,
        role: profileData.role as UserRole,
        phoneNumber: profileData.phone_number,
        dateOfBirth: profileData.date_of_birth,
        specialty: profileData.specialty,
        isApproved: profileData.is_approved
      };
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: Partial<User>, password: string): Promise<User> => {
    try {
      // Regular user registration
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
            phone_number: userData.phoneNumber,
            date_of_birth: userData.dateOfBirth,
            specialty: userData.specialty,
          }
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (!data.user) {
        throw new Error("Failed to create user");
      }
      
      // For doctors, don't log them in automatically as they need approval
      if (userData.role === UserRole.DOCTOR) {
        // Sign out if they were auto-signed in
        await supabase.auth.signOut();
      }
      
      // Create a User object
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
        fullName: userData.fullName || "User",
        role: userData.role || UserRole.PATIENT,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        specialty: userData.specialty,
        isApproved: userData.role === UserRole.DOCTOR ? false : true,
      };
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (currentUser: User, data: Partial<User>): Promise<User> => {
    try {
      if (!currentUser) {
        throw new Error("No user is logged in");
      }
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          date_of_birth: data.dateOfBirth,
          specialty: data.specialty,
        })
        .eq("id", currentUser.id);
      
      if (error) throw new Error(error.message);
      
      // Return updated user
      return { ...currentUser, ...data };
    } catch (error) {
      throw error;
    }
  }
};
