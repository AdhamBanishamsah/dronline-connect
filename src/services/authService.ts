
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";

// Helper function to convert auth user + profile data to our User type
const constructUserFromData = (authData: any, profileData: any): User => {
  return {
    id: authData.id,
    email: authData.email || '',
    fullName: profileData.full_name,
    role: profileData.role as UserRole,
    phoneNumber: profileData.phone_number,
    dateOfBirth: profileData.date_of_birth,
    isApproved: profileData.is_approved,
    specialty: profileData.specialty,
    isActive: profileData.is_approved,
  };
};

// Create and export the authService object
export const authService = {
  // Login function
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Signup function
  async signup(userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phoneNumber: string;
    dateOfBirth: string;
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw new Error(error.message);

      // Separate boolean check to fix deep instantiation error
      const isSuccess = data && data.user !== null;
      
      if (isSuccess) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user?.id,
          full_name: userData.fullName,
          role: userData.role,
          phone_number: userData.phoneNumber,
          date_of_birth: userData.dateOfBirth,
          is_approved: userData.role !== 'doctor', // Auto-approve non-doctors
          is_blocked: false
        });

        if (profileError) throw new Error(profileError.message);
        
        return data;
      }
      
      throw new Error("User registration failed");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Logout function
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw new Error(sessionError.message);
      
      if (!sessionData.session) return null;
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw new Error(userError.message);
      if (!userData.user) return null;
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();
      
      if (profileError) {
        if (profileError.code === "PGRST116") {
          // No profile found
          return null;
        }
        throw new Error(profileError.message);
      }
      
      return constructUserFromData(userData.user, profileData);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: Partial<User>) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.fullName,
          phone_number: profileData.phoneNumber,
          date_of_birth: profileData.dateOfBirth,
          specialty: profileData.specialty,
        })
        .eq("id", userId);

      if (error) throw new Error(error.message);
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Update password
  async updatePassword(currentPassword: string, newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Auth state change
  onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((_, session) => {
      callback(session);
    });
  },

  // Fetch user profile
  async fetchUserProfile(userId: string, session: any) {
    if (!userId) throw new Error("User ID is required");
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      return constructUserFromData(
        { id: userId, email: session?.user?.email || "" },
        profileData
      );
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Register
  async register(userData: Partial<User>, password: string) {
    if (!userData.email) throw new Error("Email is required");
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          role: userData.role,
        }
      }
    });

    if (error) throw error;
    
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: userData.fullName || "",
        role: userData.role || UserRole.PATIENT,
        phone_number: userData.phoneNumber || "",
        date_of_birth: userData.dateOfBirth || "",
        specialty: userData.specialty || "",
        is_approved: userData.role !== UserRole.DOCTOR, // Auto-approve non-doctors
      });

      if (profileError) throw profileError;
    }
    
    return data;
  }
};

// These exports are kept for backward compatibility
export const login = authService.login;
export const signup = authService.signup;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;
export const updateUserProfile = authService.updateUserProfile;
export const updatePassword = authService.updatePassword;
