
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/types";

/**
 * Hook to access the auth context
 */
export const useAuth = () => {
  const context = useContext<AuthContextType | undefined>(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
