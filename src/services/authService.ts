import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";

export const login = async (email: string, password: string) => {
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
};

export const signup = async (userData: {
  email: string;
  password: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  dateOfBirth: string;
}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw new Error(error.message);

    // Separate boolean check to fix deep instantiation error
    const isSuccess = data && data.user !== null;
    
    if (isSuccess) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user?.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role,
          phone_number: userData.phoneNumber,
          date_of_birth: userData.dateOfBirth,
          is_active: true,
        },
      ]);

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
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
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
      .eq("user_id", userData.user.id)
      .single();
    
    if (profileError) {
      if (profileError.code === "PGRST116") {
        // No profile found
        return null;
      }
      throw new Error(profileError.message);
    }
    
    return {
      id: userData.user.id,
      email: profileData.email,
      fullName: profileData.full_name,
      role: profileData.role as UserRole,
      phoneNumber: profileData.phone_number,
      dateOfBirth: profileData.date_of_birth,
      isActive: profileData.is_active,
      specialty: profileData.specialty,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileData.fullName,
        phone_number: profileData.phoneNumber,
        date_of_birth: profileData.dateOfBirth,
        specialty: profileData.specialty,
      })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
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
};
