
import React, { createContext, useContext, useState, useEffect } from "react";
import { Consultation, ConsultationStatus, UserRole, ConsultationComment } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ConsultationContextType {
  consultations: Consultation[];
  isLoading: boolean;
  createConsultation: (consultationData: Partial<Consultation>) => Promise<void>;
  getConsultationsByUserId: (userId: string, role: UserRole) => Consultation[];
  getConsultationById: (id: string) => Consultation | undefined;
  updateConsultationStatus: (id: string, status: ConsultationStatus) => Promise<void>;
  assignConsultation: (consultationId: string, doctorId: string) => Promise<void>;
  addConsultationComment: (consultationId: string, content: string) => Promise<void>;
}

// Mock consultations for development
const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: "1",
    patientId: "1",
    disease: "Arthritis",
    description: "Jjjwww",
    symptoms: "Joint pain, stiffness",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-28T13:15:00Z",
  },
  {
    id: "2",
    patientId: "1",
    disease: "Depression",
    description: "depression",
    symptoms: "Sadness, fatigue",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-27T10:30:00Z",
  },
  {
    id: "3",
    patientId: "1",
    disease: "Eczema",
    description: "Description",
    symptoms: "Itchy skin",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-27T08:51:00Z",
  },
  {
    id: "4",
    patientId: "1",
    disease: "Diabetes",
    description: "666666",
    symptoms: "Increased thirst",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-26T19:28:00Z",
  },
  {
    id: "5",
    patientId: "1",
    disease: "Diabetes",
    description: "55555",
    symptoms: "Increased thirst",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-26T19:23:00Z",
  },
  {
    id: "6",
    patientId: "1",
    disease: "Depression",
    description: "tetete",
    symptoms: "Sadness",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-26T18:45:00Z",
  },
];

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>(MOCK_CONSULTATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createConsultation = async (consultationData: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error("You must be logged in to create a consultation");
      }
      
      const newConsultation: Consultation = {
        id: `${consultations.length + 1}`,
        patientId: user.id,
        disease: consultationData.disease || "",
        description: consultationData.description || "",
        symptoms: consultationData.symptoms || "",
        status: ConsultationStatus.PENDING,
        images: consultationData.images,
        voiceMemo: consultationData.voiceMemo,
        createdAt: new Date().toISOString(),
        comments: [],
      };
      
      setConsultations(prev => [newConsultation, ...prev]);
      
      toast({
        title: "Consultation created",
        description: "Your consultation has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConsultationsByUserId = (userId: string, role: UserRole) => {
    // For patients, return consultations where they are the patient
    if (role === UserRole.PATIENT) {
      return consultations.filter(c => c.patientId === userId);
    }
    
    // For doctors, return consultations where they are the doctor or consultations pending assignment
    if (role === UserRole.DOCTOR) {
      return consultations.filter(c => c.doctorId === userId || !c.doctorId);
    }
    
    // For admins, return all consultations
    if (role === UserRole.ADMIN) {
      return consultations;
    }
    
    return [];
  };

  const getConsultationById = (id: string) => {
    return consultations.find(c => c.id === id);
  };

  const updateConsultationStatus = async (id: string, status: ConsultationStatus) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConsultations(prev => 
        prev.map(c => 
          c.id === id ? { ...c, status } : c
        )
      );
      
      toast({
        title: "Status updated",
        description: `Consultation status has been updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const assignConsultation = async (consultationId: string, doctorId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConsultations(prev => 
        prev.map(c => 
          c.id === consultationId 
            ? { ...c, doctorId, status: ConsultationStatus.IN_PROGRESS } 
            : c
        )
      );
      
      toast({
        title: "Consultation assigned",
        description: "You have been assigned to this consultation.",
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addConsultationComment = async (consultationId: string, content: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error("You must be logged in to add a comment");
      }
      
      const newComment: ConsultationComment = {
        id: Math.random().toString(36).substring(2, 11),
        consultationId,
        userId: user.id,
        userRole: user.role,
        content,
        createdAt: new Date().toISOString(),
      };
      
      setConsultations(prev => 
        prev.map(c => 
          c.id === consultationId 
            ? { 
                ...c, 
                comments: [...(c.comments || []), newComment] 
              } 
            : c
        )
      );
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Comment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        isLoading,
        createConsultation,
        getConsultationsByUserId,
        getConsultationById,
        updateConsultationStatus,
        assignConsultation,
        addConsultationComment,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error("useConsultations must be used within a ConsultationProvider");
  }
  return context;
};
